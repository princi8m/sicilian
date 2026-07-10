"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTestimonial(formData: FormData) {
  const reviewedAtRaw = String(formData.get("reviewedAt") || "").trim();
  await prisma.testimonial.create({
    data: {
      name:       String(formData.get("name") || "").trim() || "Anonymous",
      avatarPath: String(formData.get("avatarPath") || "").trim() || null,
      body:       String(formData.get("body") || "").trim(),
      rating:     parseInt(String(formData.get("rating") || ""), 10) || null,
      reviewedAt: reviewedAtRaw ? new Date(reviewedAtRaw) : null,
      featured:   formData.get("featured") === "on",
      order:      parseInt(String(formData.get("order") || "0"), 10) || 0,
    },
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(formData: FormData) {
  const id = String(formData.get("id"));
  const reviewedAtRaw = String(formData.get("reviewedAt") || "").trim();
  await prisma.testimonial.update({
    where: { id },
    data: {
      name:       String(formData.get("name") || "").trim() || "Anonymous",
      avatarPath: String(formData.get("avatarPath") || "").trim() || null,
      body:       String(formData.get("body") || "").trim(),
      rating:     parseInt(String(formData.get("rating") || ""), 10) || null,
      reviewedAt: reviewedAtRaw ? new Date(reviewedAtRaw) : null,
      featured:   formData.get("featured") === "on",
      order:      parseInt(String(formData.get("order") || "0"), 10) || 0,
    },
  });
  revalidatePath(`/admin/testimonials/${id}`);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateReviewSettings(formData: FormData) {
  const pairs: [string, string][] = [
    ["reviews_count",  String(formData.get("reviews_count")  || "").trim()],
    ["reviews_stars",  String(formData.get("reviews_stars")  || "").trim()],
    ["filmfreeway_url", String(formData.get("filmfreeway_url") || "").trim()],
  ];
  await Promise.all(
    pairs.map(([key, value]) =>
      prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
