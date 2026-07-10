"use server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { festival } from "@/lib/festival";
import { generateCertificate, parseCertOverrides, type CertOverrides } from "@/lib/certificate";
import { revalidatePath } from "next/cache";

function gmailTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD env vars are required");
  return nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user, pass },
  });
}

function buildHtml(
  recipient: string,
  category: string,
  customBody?: string,
) {
  const greeting = `<p>Dear ${recipient},</p>
<p>Congratulations on winning <strong>${category}</strong> at the ${festival.name}!<br>
Please find your official award certificate attached.</p>`;

  const custom = customBody
    ? `<p>${customBody.replace(/\n/g, "<br>")}</p>`
    : `<p>It has been a pleasure to have your work selected. We look forward to seeing you at future editions.</p>`;

  return `${greeting}${custom}<p>Best regards,<br><strong>${festival.name}</strong></p>`;
}

async function saveMessageIfNew(subject: string | undefined, body: string) {
  if (!body.trim()) return;
  await prisma.certMessage.create({ data: { subject: subject || null, body } });
}

export async function sendCertificate(
  _prevState: { ok: boolean; error?: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const winnerId      = String(formData.get("winnerId"));
  const includeMsg    = formData.get("includeMessage") === "1";
  const msgBody       = String(formData.get("messageBody") || "").trim();
  const msgSubject    = String(formData.get("messageSubject") || "").trim() || undefined;

  const winner = await prisma.winner.findUnique({
    where: { id: winnerId },
    include: { edition: { select: { month: true, year: true } } },
  });

  if (!winner)           return { ok: false, error: "Winner not found" };
  if (!winner.email)     return { ok: false, error: "No email address for this winner" };
  if (!winner.recipient) return { ok: false, error: "No recipient name" };

  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await generateCertificate(
      {
        recipientName: winner.recipient,
        filmTitle:     winner.filmTitle || "",
        category:      winner.category,
        month:         winner.edition.month,
        year:          winner.edition.year,
      },
      parseCertOverrides(winner.certOverrides),
    );
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "PDF generation failed" };
  }

  const safeName = (winner.recipient || "winner").replace(/\s+/g, "-").toLowerCase();
  const filename  = `certificate-${safeName}.pdf`;
  const subject   = msgSubject || `Your ${festival.name} Certificate — ${winner.category}`;

  try {
    const transport = gmailTransport();
    await transport.sendMail({
      from:        `"${festival.name}" <${process.env.GMAIL_USER}>`,
      to:          winner.email,
      subject,
      html:        buildHtml(winner.recipient, winner.category, includeMsg ? msgBody : undefined),
      attachments: [{ filename, content: Buffer.from(pdfBytes), contentType: "application/pdf" }],
    });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Email send failed" };
  }

  if (includeMsg && msgBody) await saveMessageIfNew(msgSubject, msgBody);

  await prisma.winner.update({
    where: { id: winnerId },
    data: { certificateSent: true, certificateSentAt: new Date() },
  });

  revalidatePath("/admin/certificates");
  return { ok: true };
}

export async function sendAllCertificates(
  _prevState: { ok: boolean; sent: number; errors: string[] } | null,
  formData: FormData,
): Promise<{ ok: boolean; sent: number; errors: string[] }> {
  const editionId  = String(formData.get("editionId"));
  const includeMsg = formData.get("includeMessage") === "1";
  const msgBody    = String(formData.get("messageBody") || "").trim();
  const msgSubject = String(formData.get("messageSubject") || "").trim() || undefined;

  const winners = await prisma.winner.findMany({
    where:   { editionId, email: { not: null } },
    include: { edition: { select: { month: true, year: true } } },
    orderBy: { order: "asc" },
  });

  const transport = gmailTransport();
  let sent = 0;
  const errors: string[] = [];

  for (const winner of winners) {
    if (!winner.email || !winner.recipient) continue;
    try {
      const pdfBytes = await generateCertificate(
        {
          recipientName: winner.recipient,
          filmTitle:     winner.filmTitle || "",
          category:      winner.category,
          month:         winner.edition.month,
          year:          winner.edition.year,
        },
        parseCertOverrides(winner.certOverrides),
      );
      const safeName = winner.recipient.replace(/\s+/g, "-").toLowerCase();
      const subject  = msgSubject || `Your ${festival.name} Certificate — ${winner.category}`;
      await transport.sendMail({
        from:        `"${festival.name}" <${process.env.GMAIL_USER}>`,
        to:          winner.email,
        subject,
        html:        buildHtml(winner.recipient, winner.category, includeMsg ? msgBody : undefined),
        attachments: [{ filename: `certificate-${safeName}.pdf`, content: Buffer.from(pdfBytes), contentType: "application/pdf" }],
      });
      await prisma.winner.update({
        where: { id: winner.id },
        data:  { certificateSent: true, certificateSentAt: new Date() },
      });
      sent++;
    } catch (err) {
      errors.push(`${winner.recipient}: ${err instanceof Error ? err.message : "failed"}`);
    }
  }

  if (includeMsg && msgBody && sent > 0) await saveMessageIfNew(msgSubject, msgBody);

  revalidatePath("/admin/certificates");
  return { ok: errors.length === 0, sent, errors };
}

export async function saveCertOverrides(
  _prevState: { ok: boolean; error?: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const winnerId = String(formData.get("winnerId"));
  const overrides: CertOverrides = {};
  const name     = String(formData.get("name")     || "").trim();
  const film     = String(formData.get("film")     || "").trim();
  const category = String(formData.get("category") || "").trim();
  const nameMul  = parseFloat(String(formData.get("nameSizeMultiplier")     || "1"));
  const filmMul  = parseFloat(String(formData.get("filmSizeMultiplier")     || "1"));
  const catMul   = parseFloat(String(formData.get("categorySizeMultiplier") || "1"));

  if (name)     overrides.name     = name;
  if (film)     overrides.film     = film;
  if (category) overrides.category = category;
  if (!isNaN(nameMul) && nameMul !== 1) overrides.nameSizeMultiplier     = nameMul;
  if (!isNaN(filmMul) && filmMul !== 1) overrides.filmSizeMultiplier     = filmMul;
  if (!isNaN(catMul)  && catMul  !== 1) overrides.categorySizeMultiplier = catMul;

  const isEmpty = Object.keys(overrides).length === 0;
  await prisma.winner.update({
    where: { id: winnerId },
    data:  { certOverrides: isEmpty ? null : JSON.stringify(overrides) },
  });

  revalidatePath("/admin/certificates");
  return { ok: true };
}
