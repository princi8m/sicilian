import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateCertificate, parseCertOverrides } from "@/lib/certificate";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-insecure-secret-change-me",
);

async function isAdmin(): Promise<boolean> {
  const token = cookies().get("kiez_session")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { winnerId: string } },
) {
  const download = req.nextUrl.searchParams.get("download") === "1";
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const winner = await prisma.winner.findUnique({
    where: { id: params.winnerId },
    include: { edition: { select: { month: true, year: true } } },
  });

  if (!winner) return new NextResponse("Not found", { status: 404 });

  try {
    const pdf = await generateCertificate(
      {
        recipientName: winner.recipient || "Winner",
        filmTitle:     winner.filmTitle  || "",
        category:      winner.category,
        month:         winner.edition.month,
        year:          winner.edition.year,
      },
      parseCertOverrides(winner.certOverrides),
    );

    const safeName = (winner.recipient || "certificate")
      .replace(/\s+/g, "-").toLowerCase();
    const filename = `certificate-${safeName}.pdf`;
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": download
          ? `attachment; filename="${filename}"`
          : `inline; filename="${filename}"`,
        // Prevents the CDN from caching this per-winner URL and serving a stale PDF
        // forever after edits (overrides, template changes) that should show up fresh.
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(msg, { status: 500 });
  }
}
