"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveBodyFont(formData: FormData) {
  const family = String(formData.get("family") || "archivo");
  await prisma.siteSetting.upsert({
    where: { key: "font_family" },
    update: { value: family },
    create: { key: "font_family", value: family },
  });
  revalidatePath("/");
  revalidatePath("/admin/fonts");
}

export async function saveDisplayFont(formData: FormData) {
  const family = String(formData.get("family") || "archivo");
  await prisma.siteSetting.upsert({
    where: { key: "font_display" },
    update: { value: family },
    create: { key: "font_display", value: family },
  });
  revalidatePath("/");
  revalidatePath("/admin/fonts");
}
