import { randomBytes } from "crypto";
import cloudinary from "@/lib/cloudinary";

// Certificates/laurels delivered as download links instead of email attachments.
// Files live in Cloudinary as private-by-default "raw" uploads (this account blocks public
// PDF delivery) and are served under https://<site>/awards/files/<name> by
// app/awards/files/[name]/route.ts. Names are unguessable and never listed anywhere.
// Same scheme is meant to be reused by the other festival sites (only FOLDER changes).
export const AWARD_FILES_FOLDER = "sicilian/awards";
export const AWARD_FILE_NAME = /^[a-z0-9-]{1,140}\.(pdf|png)$/;

function slugify(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

// <year>-<month>-<film-slug>-<random>.<ext>; pass the previous random part when
// regenerating a file so its link never changes.
export function awardFileName(year: number, month: number, film: string, ext: "pdf" | "png", random?: string) {
  const r = random ?? randomBytes(6).toString("base64url").replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 8);
  return `${year}-${String(month).padStart(2, "0")}-${slugify(film)}-${r}.${ext}`;
}

export async function uploadAwardFile(name: string, content: Buffer): Promise<void> {
  if (!AWARD_FILE_NAME.test(name)) throw new Error(`Invalid award file name: ${name}`);
  await new Promise<void>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "raw", public_id: `${AWARD_FILES_FOLDER}/${name}`, overwrite: true },
        (error) => (error ? reject(error) : resolve()))
      .end(content);
  });
}

// Short-lived signed URL the route handler fetches server-side.
export function awardFileSourceUrl(name: string): string {
  return cloudinary.utils.private_download_url(`${AWARD_FILES_FOLDER}/${name}`, "", {
    resource_type: "raw",
    type: "upload",
    expires_at: Math.floor(Date.now() / 1000) + 120,
  });
}
