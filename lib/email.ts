import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { festival } from "@/lib/festival";

export async function getNotificationEmail(): Promise<string> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "notification_email" },
  });
  return setting?.value || festival.contact.email;
}

export async function sendNotification({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return; // skip silently if not configured

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user, pass },
  });

  const to = await getNotificationEmail();

  try {
    await transporter.sendMail({
      from: `"${festival.name}" <${user}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email send failed:", err);
  }
}
