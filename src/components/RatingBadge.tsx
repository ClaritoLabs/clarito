import type { Rating } from "@/lib/types";
import { getRatingColor } from "@/lib/utils";

interface RatingBadgeProps {
  rating: Rating;
}

export default function RatingBadge({ rating }: RatingBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${getRatingColor(rating)}`}
    >
      {rating}
    </span>
  );
}
