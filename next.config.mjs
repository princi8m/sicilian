/** @type {import('next').NextConfig} */
const nextConfig = {
  // /reviews pagination moved from ?page=N to /reviews/page/N so the page can be static.
  async redirects() {
    return [
      {
        source: "/reviews",
        has: [{ type: "query", key: "page", value: "(?<page>[1-9]\\d{0,3})" }],
        destination: "/reviews/page/:page",
        permanent: true,
      },
    ];
  },
  // Using plain <img> tags in the scaffold so any image path/URL works without
  // configuring remote domains. Switch to next/image later if you want optimization.
  // @napi-rs/canvas ships a native .node binary (for laurel image generation) — webpack
  // can't parse that, so it must stay external and be require()'d directly at runtime
  // instead of being bundled. Moved out of `experimental` for Next.js 15 (renamed to
  // serverExternalPackages and promoted to a top-level option).
  serverExternalPackages: ["@napi-rs/canvas"],
  experimental: {
    // Default Server Action body limit is 1mb — far too small for video
    // uploads (review videos go through a Server Action to Cloudinary).
    serverActions: {
      bodySizeLimit: "500mb",
    },
    // Cap static-generation workers to 1 so build-time page rendering (e.g. every
    // /winners/[year]/[month] from generateStaticParams) opens DB connections sequentially,
    // not in parallel — this account's DB pool is capped and a previous fully-parallel build
    // blew past max_user_connections and failed a deploy.
    cpus: 1,
  },
};
export default nextConfig;
