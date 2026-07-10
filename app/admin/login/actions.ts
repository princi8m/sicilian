"use server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  const ok = admin && (await verifyPassword(password, admin.passwordHash));
  if (!ok) redirect("/admin/login?error=1");
  await createSession(admin!.id, admin!.email);
  redirect("/admin");
}
