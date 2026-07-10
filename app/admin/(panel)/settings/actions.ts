"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const NAV_KEYS = ["submissions","winners","reviews","events","photos","dates","shop","contact","impressum"];

export async function saveSettings(formData: FormData) {
  const notificationEmail = String(formData.get("notification_email") || "").trim();

  if (notificationEmail) {
    await prisma.siteSetting.upsert({
      where:  { key: "notification_email" },
      update: { value: notificationEmail },
      create: { key: "notification_email", value: notificationEmail },
    });
  }

  for (const key of NAV_KEYS) {
    const val = formData.get(`nav_${key}`) === "on" ? "1" : "0";
    await prisma.siteSetting.upsert({
      where:  { key: `nav_${key}` },
      update: { value: val },
      create: { key: `nav_${key}`, value: val },
    });
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}
