import { AWARD_FILE_NAME, awardFileSourceUrl } from "@/lib/award-files";

// Serves one certificate/laurel by its exact unguessable name (see lib/award-files.ts).
// There is no index route under /awards/files, so nothing can be listed.
export const dynamic = "force-dynamic";

const NOINDEX = { "X-Robots-Tag": "noindex, nofollow, noarchive" };

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!AWARD_FILE_NAME.test(name)) return new Response("Not found", { status: 404, headers: NOINDEX });

  let upstream: Response;
  try {
    upstream = await fetch(awardFileSourceUrl(name), { signal: AbortSignal.timeout(20_000), cache: "no-store" });
  } catch {
    return new Response("Temporarily unavailable", { status: 503, headers: NOINDEX });
  }
  if (!upstream.ok || !upstream.body) return new Response("Not found", { status: 404, headers: NOINDEX });

  return new Response(upstream.body, {
    headers: {
      ...NOINDEX,
      "Content-Type": name.endsWith(".pdf") ? "application/pdf" : "image/png",
      "Content-Disposition": `inline; filename="${name}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
