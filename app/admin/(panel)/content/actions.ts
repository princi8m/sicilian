"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CONTENT_REGISTRY } from "@/lib/content";

const VALID_KEYS = new Set(CONTENT_REGISTRY.flatMap(s => s.fields.map(f => f.key)));

export async function saveSection(formData: FormData) {
  const entries: Array<{ key: string; value: string }> = [];
  for (const [name, value] of formData.entries()) {
    if (VALID_KEYS.has(name)) {
      entries.push({ key: name, value: String(value) });
    }
  }
  await Promise.all(
    entries.map(({ key, value }) =>
      prisma.siteSetting.upsert({
        where:  { key },
        update: { value },
        create: { key, value },
      })
    )
  );
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/submissions");
  revalidatePath("/winners");
  revalidatePath("/photos");
  revalidatePath("/reviews");
  revalidatePath("/dates");
  revalidatePath("/admin/content");
}
