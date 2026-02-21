import type { Rating } from "@/lib/types";
import { getRatingColor } from "@/lib/utils";

interface RatingBadgeProps {
  rating: Rating;
  size?: "sm" | "lg";
}

const ratingEmoji: Record<Rating, string> = {
  Excelente: "✨",
  Bueno: "👍",
  Mediocre: "⚠️",
  Malo: "👎",
};

export default function RatingBadge({ rating, size = "sm" }: RatingBadgeProps) {
  const isLarge = size === "lg";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${getRatingColor(rating)} ${
        isLarge ? "px-5 py-2 text-base" : "px-4 py-1.5 text-sm"
      }`}
    >
      <span>{ratingEmoji[rating]}</span>
      {rating}
    </span>
  );
}
