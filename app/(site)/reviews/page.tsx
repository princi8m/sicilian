import ReviewsIndex from "./ReviewsIndex";

export const revalidate = 86400;

export default function ReviewsPage() {
  return <ReviewsIndex page={1} />;
}
