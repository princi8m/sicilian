"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FIELD_POSITION_KEYS } from "@/lib/field-positions";

export type FieldPositionState = { ok: true } | { ok: false; error: string } | null;

async function saveFieldPositions(key: string, formData: FormData): Promise<FieldPositionState> {
  const raw = String(formData.get("layout") || "");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Invalid layout data" };
  }
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "Invalid layout data" };
  }

  const value = JSON.stringify(parsed);
  await prisma.siteSetting.upsert({
    where:  { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath("/admin/certificates");
  return { ok: true };
}

export async function saveCertFieldPositions(_prev: FieldPositionState, formData: FormData): Promise<FieldPositionState> {
  return saveFieldPositions(FIELD_POSITION_KEYS.certificate, formData);
}

export async function saveLaurelFieldPositions(_prev: FieldPositionState, formData: FormData): Promise<FieldPositionState> {
  return saveFieldPositions(FIELD_POSITION_KEYS.laurel, formData);
}

export async function resetCertFieldPositions(): Promise<void> {
  await prisma.siteSetting.deleteMany({ where: { key: FIELD_POSITION_KEYS.certificate } });
  revalidatePath("/admin/certificates");
}

export async function resetLaurelFieldPositions(): Promise<void> {
  await prisma.siteSetting.deleteMany({ where: { key: FIELD_POSITION_KEYS.laurel } });
  revalidatePath("/admin/certificates");
}
