import { notFound, redirect } from "next/navigation";
import ReviewsIndex from "../../ReviewsIndex";

export const revalidate = 86400;

// Empty list = nothing pre-rendered at build (no DB connections then), but each page is
// still cached via ISR after its first visit instead of rendering live every time.
export async function generateStaticParams() {
  return [];
}

export default async function ReviewsPageN({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  // Reject malformed params (bot probes) before touching the DB.
  if (!/^[1-9]\d{0,3}$/.test(n)) notFound();
  const page = parseInt(n, 10);
  if (page === 1) redirect("/reviews");
  return <ReviewsIndex page={page} />;
}
