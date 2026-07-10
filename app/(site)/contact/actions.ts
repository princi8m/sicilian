"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { sendNotification } from "@/lib/email";

export async function submitContact(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim() || null;
  const message = String(formData.get("message") || "").trim();
  if (!name || !email || !message) redirect("/contact?error=1");

  await prisma.contactMessage.create({ data: { name, email, subject, message } });

  await sendNotification({
    subject: subject ? `Contact: ${subject}` : `New message from ${name}`,
    html: `
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${message}</p>
    `,
  });

  redirect("/contact?sent=1");
}
