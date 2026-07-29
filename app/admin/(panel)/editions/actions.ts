"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { festival } from "@/lib/festival";

// Minimal CSV parser: handles quoted fields and escaped quotes ("").
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  // Normalise line endings and strip BOM
  const lines = text.replace(/^﻿/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;
    const cells: string[] = [];
    let cur = "";
    let inQ = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === "," && !inQ) {
        cells.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    cells.push(cur.trim());
    rows.push(cells);
  }
  return rows;
}

function slugFor(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export async function createEdition(formData: FormData) {
  const year = parseInt(String(formData.get("year")), 10);
  const month = parseInt(String(formData.get("month")), 10);
  const title = String(formData.get("title") || "").trim() || null;
  const published = formData.get("published") === "on";
  if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
    redirect("/admin/editions/new?error=1");
  }
  try {
    const edition = await prisma.edition.create({
      data: { year, month, title, published, slug: slugFor(year, month) },
    });
    redirect(`/admin/editions/${edition.id}`);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("slug") || msg.includes("unique") || msg.includes("Unique")) {
      redirect(`/admin/editions/new?error=duplicate&year=${year}&month=${month}`);
    }
    throw e;
  }
}

export async function updateEdition(formData: FormData) {
  const id = String(formData.get("id"));
  const year = parseInt(String(formData.get("year")), 10);
  const month = parseInt(String(formData.get("month")), 10);
  const title = String(formData.get("title") || "").trim() || null;
  const published = formData.get("published") === "on";
  await prisma.edition.update({
    where: { id },
    data: { year, month, title, published, slug: slugFor(year, month) },
  });
  revalidatePath(`/admin/editions/${id}`);
  revalidatePath("/admin/editions");
}

export async function deleteEdition(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.edition.delete({ where: { id } });
  redirect("/admin/editions");
}

export async function addWinner(formData: FormData) {
  const editionId = String(formData.get("editionId"));
  await prisma.winner.create({
    data: {
      editionId,
      category: String(formData.get("category") || "").trim() || "Award",
      filmTitle: String(formData.get("filmTitle") || "").trim() || null,
      recipient: String(formData.get("recipient") || "").trim() || null,
      country: String(formData.get("country") || "").trim() || null,
      email: String(formData.get("email") || "").trim() || null,
      imagePath: String(formData.get("imagePath") || "").trim() || null,
      order: parseInt(String(formData.get("order") || "0"), 10) || 0,
    },
  });
  revalidatePath(`/admin/editions/${editionId}`);
}

export async function updateWinner(formData: FormData) {
  const id = String(formData.get("id"));
  const editionId = String(formData.get("editionId"));
  await prisma.winner.update({
    where: { id },
    data: {
      category: String(formData.get("category") || "").trim() || "Award",
      filmTitle: String(formData.get("filmTitle") || "").trim() || null,
      recipient: String(formData.get("recipient") || "").trim() || null,
      country: String(formData.get("country") || "").trim() || null,
      email: String(formData.get("email") || "").trim() || null,
      imagePath: String(formData.get("imagePath") || "").trim() || null,
    },
  });
  revalidatePath(`/admin/editions/${editionId}`);
  revalidatePath("/winners");
}

export async function deleteWinner(formData: FormData) {
  const id = String(formData.get("id"));
  const editionId = String(formData.get("editionId"));
  await prisma.winner.delete({ where: { id } });
  revalidatePath(`/admin/editions/${editionId}`);
}

export async function importWinners(formData: FormData): Promise<void> {
  const editionId = String(formData.get("editionId"));
  const file = formData.get("csvFile") as File | null;
  const hasHeader = formData.get("hasHeader") !== "off"; // default true

  if (!file || file.size === 0) return;

  const text = await file.text();
  const rows = parseCSV(text);
  if (rows.length === 0) return;

  const dataRows = hasHeader ? rows.slice(1) : rows;

  const last = await prisma.winner.findFirst({
    where: { editionId },
    orderBy: { order: "desc" },
  });
  let nextOrder = (last?.order ?? -1) + 1;

  // col 0 = film title, col 1 = recipient, col 2 = category/prize, col 3 = country (optional), col 4 = email (optional)
  const data = dataRows
    .filter((row) => row.some((c) => c))
    .map((row) => ({
      editionId,
      filmTitle: row[0] || null,
      recipient: row[1] || null,
      category: row[2] || "Award",
      country: row[3] || null,
      email: row[4] || null,
      order: nextOrder++,
    }));

  if (data.length === 0) return;

  await prisma.winner.createMany({ data });
  revalidatePath(`/admin/editions/${editionId}`);
  revalidatePath("/winners");
}

export async function addSeasonImage(formData: FormData) {
  const editionId = String(formData.get("editionId"));
  const caption = String(formData.get("caption") || "").trim() || null;
  const files = formData.getAll("files") as File[];
  const validFiles = files.filter((f) => f.size > 0);

  if (validFiles.length === 0) return;

  const last = await prisma.seasonImage.findFirst({
    where: { editionId },
    orderBy: { order: "desc" },
  });
  let nextOrder = (last?.order ?? 0) + 1;

  for (const file of validFiles) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: festival.cloudinary.posters }, (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        })
        .end(buffer);
    });

    await prisma.seasonImage.create({
      data: {
        editionId,
        imagePath: result.secure_url,
        cloudinaryId: result.public_id,
        caption,
        order: nextOrder++,
      },
    });
  }

  revalidatePath(`/admin/editions/${editionId}`);
  revalidatePath(`/winners`);
  revalidatePath("/");
}

export async function updateSeasonImage(formData: FormData) {
  const id = String(formData.get("id"));
  const editionId = String(formData.get("editionId"));
  const caption = String(formData.get("caption") || "").trim() || null;
  await prisma.seasonImage.update({ where: { id }, data: { caption } });
  revalidatePath(`/admin/editions/${editionId}`);
  revalidatePath("/winners");
}

export async function deleteSeasonImage(formData: FormData) {
  const id = String(formData.get("id"));
  const editionId = String(formData.get("editionId"));

  const img = await prisma.seasonImage.findUnique({ where: { id } });
  if (img?.cloudinaryId) {
    try { await cloudinary.uploader.destroy(img.cloudinaryId); } catch {}
  }

  await prisma.seasonImage.delete({ where: { id } });
  revalidatePath(`/admin/editions/${editionId}`);
  revalidatePath("/");
}

export async function removeFromCarousel(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.seasonImage.update({ where: { id }, data: { featuredInCarousel: false } });
  revalidatePath("/admin/carousel");
  revalidatePath("/");
}

export async function saveAllCarousel(formData: FormData) {
  const ids = formData.getAll("imageId") as string[];
  const editionId = String(formData.get("editionId"));
  await Promise.all(
    ids.map((id) =>
      prisma.seasonImage.update({
        where: { id },
        data: { featuredInCarousel: formData.get(`carousel_${id}`) === "on" },
      })
    )
  );
  revalidatePath(`/admin/editions/${editionId}`);
  revalidatePath("/");
}
