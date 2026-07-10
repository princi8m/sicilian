"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDate(formData: FormData) {
  const title    = String(formData.get("title") || "").trim();
  const type     = String(formData.get("type") || "EVENT") as "EVENT" | "DEADLINE" | "OTHER";
  const startsAt = new Date(String(formData.get("startsAt")));
  const endsAtRaw = String(formData.get("endsAt") || "").trim();
  const endsAt   = endsAtRaw ? new Date(endsAtRaw) : null;
  const location = String(formData.get("location") || "").trim() || null;
  const description = String(formData.get("description") || "").trim() || null;

  if (!title || isNaN(startsAt.getTime())) return;

  await prisma.eventDate.create({
    data: { title, type, startsAt, endsAt, location, description },
  });
  revalidatePath("/admin/dates");
  revalidatePath("/dates");
}

export async function updateDate(
  _prev: { ok: boolean; error?: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const id       = String(formData.get("id"));
  const title    = String(formData.get("title") || "").trim();
  const type     = String(formData.get("type") || "EVENT") as "EVENT" | "DEADLINE" | "OTHER";
  const startsAt = new Date(String(formData.get("startsAt")));
  const endsAtRaw = String(formData.get("endsAt") || "").trim();
  const endsAt   = endsAtRaw ? new Date(endsAtRaw) : null;
  const location = String(formData.get("location") || "").trim() || null;
  const description = String(formData.get("description") || "").trim() || null;

  if (!title || isNaN(startsAt.getTime())) return { ok: false, error: "Title and start date are required" };

  await prisma.eventDate.update({
    where: { id },
    data: { title, type, startsAt, endsAt, location, description },
  });
  revalidatePath("/admin/dates");
  revalidatePath("/dates");
  return { ok: true };
}

export async function deleteDate(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.eventDate.delete({ where: { id } });
  revalidatePath("/admin/dates");
  revalidatePath("/dates");
}

export async function updateDatesIntro(formData: FormData) {
  const value = String(formData.get("intro") || "").trim();
  await prisma.siteSetting.upsert({
    where: { key: "dates_intro" },
    update: { value },
    create: { key: "dates_intro", value },
  });
  revalidatePath("/dates");
}
