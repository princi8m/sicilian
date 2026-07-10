"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

export async function saveLogo(formData: FormData) {
  const height = parseInt(String(formData.get("height") || "32"), 10) || 32;
  const file = formData.get("file") as File | null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = (file.name.split(".").pop() ?? "png").toLowerCase();
    const filename = `logo-mark.${ext}`;
    const dest = path.join(process.cwd(), "public", "uploads", filename);
    await writeFile(dest, buffer);
    await prisma.siteSetting.upsert({
      where: { key: "logo_path" },
      update: { value: `/uploads/${filename}` },
      create: { key: "logo_path", value: `/uploads/${filename}` },
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: "logo_height" },
    update: { value: String(height) },
    create: { key: "logo_height", value: String(height) },
  });

  revalidatePath("/admin/logo");
  revalidatePath("/");
}
