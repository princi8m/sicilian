import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import JSZip from "jszip";
import { prisma } from "@/lib/prisma";
import { generateCertificate, parseCertOverrides } from "@/lib/certificate";
import { MONTHS } from "@/lib/session";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-insecure-secret-change-me",
);

async function isAdmin(): Promise<boolean> {
  const token = cookies().get("kiez_session")?.value;
  if (!token) return false;
  try { await jwtVerify(token, secret); return true; } catch { return false; }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const editionId = req.nextUrl.searchParams.get("editionId");
  if (!editionId) return new NextResponse("editionId required", { status: 400 });

  const edition = await prisma.edition.findUnique({
    where:  { id: editionId },
    select: { month: true, year: true },
  });
  if (!edition) return new NextResponse("Edition not found", { status: 404 });

  const winners = await prisma.winner.findMany({
    where:   { editionId },
    orderBy: { order: "asc" },
  });

  const zip      = new JSZip();
  const month    = MONTHS[edition.month - 1];
  const label    = `${month}-${edition.year}`;
  const folder   = zip.folder(label)!;
  const errors:  string[] = [];

  for (const w of winners) {
    if (!w.recipient) continue;
    try {
      const pdf = await generateCertificate(
        {
          recipientName: w.recipient,
          filmTitle:     w.filmTitle  || "",
          category:      w.category,
          month:         edition.month,
          year:          edition.year,
        },
        parseCertOverrides(w.certOverrides),
      );
      const safeName = w.recipient.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
      folder.file(`certificate-${safeName}.pdf`, pdf);
    } catch (err) {
      errors.push(w.recipient);
    }
  }

  if (errors.length > 0) {
    console.error("Certificate generation failed for:", errors);
  }

  const zipBytes = await zip.generateAsync({ type: "uint8array" });

  return new NextResponse(Buffer.from(zipBytes), {
    headers: {
      "Content-Type":        "application/zip",
      "Content-Disposition": `attachment; filename="certificates-${label}.zip"`,
    },
  });
}
