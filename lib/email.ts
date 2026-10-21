import { prisma } from "@/lib/prisma";
import { festival } from "@/lib/festival";
import { createSmtpTransport, smtpConfigured, smtpFrom } from "@/lib/mailer";

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
  if (!smtpConfigured()) return; // skip silently if not configured
  const transporter = createSmtpTransport();

  const to = await getNotificationEmail();

  try {
    await transporter.sendMail({
      from: smtpFrom(),
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email send failed:", err);
  }
}
