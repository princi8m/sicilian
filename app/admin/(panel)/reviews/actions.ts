"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary";
import { festival } from "@/lib/festival";
import type { UploadApiResponse } from "cloudinary";

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "video" = "image",
): Promise<UploadApiResponse> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: resourceType }, (error, result) => {
        if (error) reject(error);
        else resolve(result!);
      })
      .end(buffer);
  });
}

export async function createReview(formData: FormData) {
  const filmTitle  = String(formData.get("filmTitle")  || "").trim();
  const director   = String(formData.get("director")   || "").trim() || null;
  const body       = String(formData.get("body")        || "").trim();
  const published  = formData.get("published") === "on";
  const youtubeUrl = String(formData.get("youtubeUrl") || "").trim() || null;
  if (!filmTitle) return;

  const slug = slugify(filmTitle);

  let coverImage: string | null = null;
  let coverCloudinaryId: string | null = null;
  const coverFile = formData.get("coverImage") as File | null;
  if (coverFile && coverFile.size > 0) {
    const result = await uploadToCloudinary(coverFile, festival.cloudinary.reviewCovers);
    coverImage = result.secure_url;
    coverCloudinaryId = result.public_id;
  }

  let videoUrl: string | null = null;
  let videoCloudinaryId: string | null = null;
  const videoFile = formData.get("videoFile") as File | null;
  if (videoFile && videoFile.size > 0) {
    const result = await uploadToCloudinary(videoFile, festival.cloudinary.reviewVideos, "video");
    videoUrl = result.secure_url;
    videoCloudinaryId = result.public_id;
  }

  const review = await prisma.filmReview.create({
    data: {
      slug,
      filmTitle,
      director,
      body,
      coverImage,
      coverCloudinaryId,
      videoUrl,
      videoCloudinaryId,
      youtubeUrl,
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  redirect(`/admin/reviews/${review.id}`);
}

export async function updateReview(formData: FormData) {
  const id         = String(formData.get("id"));
  const filmTitle  = String(formData.get("filmTitle")  || "").trim();
  const director   = String(formData.get("director")   || "").trim() || null;
  const body       = String(formData.get("body")        || "").trim();
  const published  = formData.get("published") === "on";
  const youtubeUrl = String(formData.get("youtubeUrl") || "").trim() || null;
  const removeVideo = formData.get("removeVideo") === "on";
  if (!filmTitle) return;

  const existing = await prisma.filmReview.findUnique({ where: { id } });
  if (!existing) return;

  let coverImage        = existing.coverImage;
  let coverCloudinaryId = existing.coverCloudinaryId;
  const coverFile = formData.get("coverImage") as File | null;
  if (coverFile && coverFile.size > 0) {
    if (coverCloudinaryId) {
      try { await cloudinary.uploader.destroy(coverCloudinaryId); } catch {}
    }
    const result = await uploadToCloudinary(coverFile, festival.cloudinary.reviewCovers);
    coverImage = result.secure_url;
    coverCloudinaryId = result.public_id;
  }

  let videoUrl        = existing.videoUrl;
  let videoCloudinaryId = existing.videoCloudinaryId;
  const videoFile = formData.get("videoFile") as File | null;
  if (removeVideo && videoCloudinaryId) {
    try { await cloudinary.uploader.destroy(videoCloudinaryId, { resource_type: "video" }); } catch {}
    videoUrl = null;
    videoCloudinaryId = null;
  }
  if (videoFile && videoFile.size > 0) {
    if (videoCloudinaryId) {
      try { await cloudinary.uploader.destroy(videoCloudinaryId, { resource_type: "video" }); } catch {}
    }
    const result = await uploadToCloudinary(videoFile, festival.cloudinary.reviewVideos, "video");
    videoUrl = result.secure_url;
    videoCloudinaryId = result.public_id;
  }

  await prisma.filmReview.update({
    where: { id },
    data: {
      filmTitle,
      director,
      body,
      coverImage,
      coverCloudinaryId,
      videoUrl,
      videoCloudinaryId,
      youtubeUrl,
      published,
      publishedAt: published && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  });

  revalidatePath(`/admin/reviews/${id}`);
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  redirect("/admin/reviews");
}

export async function deleteReview(formData: FormData) {
  const id = String(formData.get("id"));
  const review = await prisma.filmReview.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!review) return;

  // Clean up Cloudinary assets
  if (review.coverCloudinaryId) {
    try { await cloudinary.uploader.destroy(review.coverCloudinaryId); } catch {}
  }
  if (review.videoCloudinaryId) {
    try { await cloudinary.uploader.destroy(review.videoCloudinaryId, { resource_type: "video" }); } catch {}
  }
  for (const img of review.images) {
    if (img.cloudinaryId) {
      try { await cloudinary.uploader.destroy(img.cloudinaryId); } catch {}
    }
  }

  await prisma.filmReview.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  redirect("/admin/reviews");
}

export async function addReviewImage(formData: FormData) {
  const reviewId = String(formData.get("reviewId"));
  const caption  = String(formData.get("caption") || "").trim() || null;
  const files    = formData.getAll("files") as File[];
  const valid    = files.filter((f) => f.size > 0);
  if (valid.length === 0) return;

  const last = await prisma.reviewImage.findFirst({
    where: { reviewId },
    orderBy: { order: "desc" },
  });
  let nextOrder = (last?.order ?? 0) + 1;

  for (const file of valid) {
    const result = await uploadToCloudinary(file, festival.cloudinary.reviewImages);
    await prisma.reviewImage.create({
      data: {
        reviewId,
        imagePath: result.secure_url,
        cloudinaryId: result.public_id,
        caption,
        order: nextOrder++,
      },
    });
  }

  revalidatePath(`/admin/reviews/${reviewId}`);
  revalidatePath("/reviews");
}

export async function deleteReviewImage(formData: FormData) {
  const id       = String(formData.get("id"));
  const reviewId = String(formData.get("reviewId"));
  const img = await prisma.reviewImage.findUnique({ where: { id } });
  if (img?.cloudinaryId) {
    try { await cloudinary.uploader.destroy(img.cloudinaryId); } catch {}
  }
  await prisma.reviewImage.delete({ where: { id } });
  revalidatePath(`/admin/reviews/${reviewId}`);
  revalidatePath("/reviews");
}
