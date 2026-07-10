"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary";
import { festival } from "@/lib/festival";
import type { UploadApiResponse } from "cloudinary";

/**
 * Uploads exactly one photo. Called once per file from the client so the
 * upload page can show real "N of M uploaded" progress — a single
 * multi-file form submission has no per-file feedback until the whole
 * batch finishes.
 */
export async function uploadPhotoSingle(
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const file = formData.get("file") as File | null;
  const caption = String(formData.get("caption") || "").trim() || null;
  const featuredOnHome = formData.get("featuredOnHome") === "on";

  if (!file || file.size === 0) return { ok: false, error: "No file provided" };

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: festival.cloudinary.photos }, (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        })
        .end(buffer);
    });

    const last = await prisma.eventPhoto.findFirst({ orderBy: { order: "desc" } });
    const nextOrder = (last?.order ?? 0) + 1;

    await prisma.eventPhoto.create({
      data: {
        imagePath: result.secure_url,
        caption,
        featuredOnHome,
        order: nextOrder,
      },
    });

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Upload failed" };
  }
}

export async function finishPhotoUpload() {
  revalidatePath("/admin/photos");
  revalidatePath("/photos");
  revalidatePath("/");
  redirect("/admin/photos");
}

export async function deletePhoto(formData: FormData) {
  const id = String(formData.get("id"));
  const photo = await prisma.eventPhoto.findUnique({ where: { id } });
  if (!photo) return;

  try {
    // Extract public_id from the Cloudinary delivery URL (works regardless
    // of folder) and delete from cloud: .../upload/v123456/folder/name.ext
    const match = photo.imagePath.match(/\/upload\/v\d+\/(.+)\.[a-zA-Z0-9]+$/);
    if (match) await cloudinary.uploader.destroy(match[1]);
  } catch {}

  await prisma.eventPhoto.delete({ where: { id } });
  revalidatePath("/admin/photos");
  revalidatePath("/photos");
  revalidatePath("/");
}

export async function toggleFeatured(formData: FormData) {
  const id = String(formData.get("id"));
  const featured = formData.get("featuredOnHome") === "on";
  await prisma.eventPhoto.update({ where: { id }, data: { featuredOnHome: featured } });
  revalidatePath("/admin/photos");
  revalidatePath("/");
}

export async function saveAllFeatured(formData: FormData) {
  const ids = formData.getAll("photoId") as string[];
  await Promise.all(
    ids.map((id) =>
      prisma.eventPhoto.update({
        where: { id },
        data: { featuredOnHome: formData.get(`featured_${id}`) === "on" },
      })
    )
  );
  revalidatePath("/admin/photos");
  revalidatePath("/photos");
  revalidatePath("/");
}

export async function movePhoto(formData: FormData) {
  const id = String(formData.get("id"));
  const direction = String(formData.get("direction"));

  const photos = await prisma.eventPhoto.findMany({ orderBy: { order: "asc" } });
  const idx = photos.findIndex((p) => p.id === id);
  if (idx === -1) return;

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= photos.length) return;

  const a = photos[idx];
  const b = photos[swapIdx];

  await prisma.$transaction([
    prisma.eventPhoto.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.eventPhoto.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);

  revalidatePath("/admin/photos");
  revalidatePath("/photos");
  revalidatePath("/");
}
