/** @type {import('next').NextConfig} */
const nextConfig = {
  // Using plain <img> tags in the scaffold so any image path/URL works without
  // configuring remote domains. Switch to next/image later if you want optimization.
  experimental: {
    // Default Server Action body limit is 1mb — far too small for video
    // uploads (review videos go through a Server Action to Cloudinary).
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
};
export default nextConfig;
