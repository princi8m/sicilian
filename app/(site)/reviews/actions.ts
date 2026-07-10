"use server";
import { prisma } from "@/lib/prisma";
import { sendNotification } from "@/lib/email";

export async function submitReviewRequest(formData: FormData) {
  const projectName = String(formData.get("projectName") || "").trim();
  const name        = String(formData.get("name")        || "").trim();
  const email       = String(formData.get("email")       || "").trim();
  const notes       = String(formData.get("notes")       || "").trim();

  if (!name || !email) return { error: "Name and email are required." };

  const subject = projectName ? `Review request: ${projectName}` : "Review request";

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      subject,
      message: notes || "(no additional notes)",
    },
  });

  await sendNotification({
    subject,
    html: `
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      ${projectName ? `<p><strong>Project:</strong> ${projectName}</p>` : ""}
      ${notes ? `<p><strong>Notes:</strong></p><p style="white-space:pre-wrap">${notes}</p>` : ""}
    `,
  });

  return { success: true };
}
