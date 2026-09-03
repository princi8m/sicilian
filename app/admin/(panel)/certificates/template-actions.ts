"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

const TEMPLATE_SETTING_KEY = "certificate_template";
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export async function uploadCertificateTemplate(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("No file selected");
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Template must be a JPG or PNG image");
  }

  const bytes  = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "sicilian/certificates" }, (error, result) => {
        if (error) reject(error);
        else resolve(result!);
      })
      .end(bytes);
  });

  const previous = await prisma.siteSetting.findUnique({
    where: { key: TEMPLATE_SETTING_KEY },
  });

  const value = JSON.stringify({
    url:      result.secure_url,
    publicId: result.public_id,
    format:   result.format,
  });

  await prisma.siteSetting.upsert({
    where:  { key: TEMPLATE_SETTING_KEY },
    update: { value },
    create: { key: TEMPLATE_SETTING_KEY, value },
  });

  if (previous) {
    try {
      const prevRecord = JSON.parse(previous.value);
      if (prevRecord?.publicId) await cloudinary.uploader.destroy(prevRecord.publicId);
    } catch {}
  }

  revalidatePath("/admin/certificates");
}

const LAUREL_TEMPLATE_SETTING_KEY = "laurel_template";

export async function uploadLaurelTemplate(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("No file selected");
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Template must be a JPG or PNG image");
  }

  const bytes  = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "sicilian/laurels" }, (error, result) => {
        if (error) reject(error);
        else resolve(result!);
      })
      .end(bytes);
  });

  const previous = await prisma.siteSetting.findUnique({
    where: { key: LAUREL_TEMPLATE_SETTING_KEY },
  });

  const value = JSON.stringify({
    url:      result.secure_url,
    publicId: result.public_id,
    format:   result.format,
  });

  await prisma.siteSetting.upsert({
    where:  { key: LAUREL_TEMPLATE_SETTING_KEY },
    update: { value },
    create: { key: LAUREL_TEMPLATE_SETTING_KEY, value },
  });

  if (previous) {
    try {
      const prevRecord = JSON.parse(previous.value);
      if (prevRecord?.publicId) await cloudinary.uploader.destroy(prevRecord.publicId);
    } catch {}
  }

  revalidatePath("/admin/certificates");
}
