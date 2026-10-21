import type { MetadataRoute } from "next";

// Certificate/laurel download links (/awards/files/…) must never be indexed;
// the route also sends X-Robots-Tag: noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/awards/"] },
  };
}
