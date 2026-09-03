import type { FieldLayout } from "festival-engine-core";
import { prisma } from "@/lib/prisma";
import { CERT_DEFAULT_LAYOUT, type CertFieldKey } from "@/lib/certificate-config";
import { LAUREL_DEFAULT_LAYOUT, type LaurelFieldKey } from "@/lib/laurel-config";

const CERT_KEY = "certificate_field_positions";
const LAUREL_KEY = "laurel_field_positions";

function parseFieldPositions<K extends string>(value: string): Record<K, FieldLayout> | null {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? (parsed as Record<K, FieldLayout>) : null;
  } catch {
    return null;
  }
}

// Whole-object replace, not a per-field merge — the editor always saves every field for
// a format at once, so a SiteSetting row is either absent (use the code default below)
// or complete (use it entirely). See app/admin/(panel)/certificates/field-position-actions.ts
// for the write side.
export async function getCertFieldPositions(): Promise<Record<CertFieldKey, FieldLayout>> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: CERT_KEY } });
  const parsed = setting ? parseFieldPositions<CertFieldKey>(setting.value) : null;
  return parsed ?? CERT_DEFAULT_LAYOUT;
}

export async function getLaurelFieldPositions(): Promise<Record<LaurelFieldKey, FieldLayout>> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: LAUREL_KEY } });
  const parsed = setting ? parseFieldPositions<LaurelFieldKey>(setting.value) : null;
  return parsed ?? LAUREL_DEFAULT_LAYOUT;
}

export const FIELD_POSITION_KEYS = { certificate: CERT_KEY, laurel: LAUREL_KEY } as const;
