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
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return; // skip silently if not configured

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user, pass },
    // Public contact/review forms call this — an unbounded connection here can hang a
    // request indefinitely on a bad SMTP handshake, holding a process open. Root cause of
    // the 2026-08-11 account-wide Hostinger process exhaustion. Same fail-fast timeouts as
    // the certificate-send transport in this file.
    connectionTimeout: 10_000,
    greetingTimeout:   10_000,
    socketTimeout:     20_000,
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
