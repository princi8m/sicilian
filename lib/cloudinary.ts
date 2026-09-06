import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // The SDK's own default (60s) is already a real bound, not "no timeout" — but that's
  // still generous compared to every other external call in this codebase family (DB
  // queries, SMTP), which all fail fast within 10-20s. Tightened for consistency.
  timeout: 20_000,
});

export default cloudinary;
