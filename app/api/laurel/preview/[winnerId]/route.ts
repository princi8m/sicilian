import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateLaurel, parseLaurelOverrides } from "@/lib/laurel";

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
    const png = await generateLaurel(
      {
        category: winner.category,
        month:    winner.edition.month,
        year:     winner.edition.year,
      },
      parseLaurelOverrides(winner.laurelOverrides),
    );

    const safeName = (winner.recipient || "laurel")
      .replace(/\s+/g, "-").toLowerCase();
    const filename = `laurel-${safeName}.png`;
    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type":        "image/png",
        "Content-Disposition": download
          ? `attachment; filename="${filename}"`
          : `inline; filename="${filename}"`,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(msg, { status: 500 });
  }
}
