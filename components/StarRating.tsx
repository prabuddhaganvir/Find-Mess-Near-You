import { Star } from "lucide-react";

export default function StarRating({
  rating = 0,
  count = 0,
  editable = false,
  onRate,
}: {
  rating?: number;
  count?: number;
  editable?: boolean;
  onRate?: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={16}
            onClick={() => editable && onRate?.(i)}
            className={`
              ${i <= Math.round(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"}
              ${editable ? "cursor-pointer hover:scale-110 transition" : ""}
            `}
          />
        ))}
      </div>

      <span className="text-sm font-semibold">
        {rating ? rating.toFixed(1) : "New"}
      </span>

      {count > 0 && (
        <span className="text-xs text-gray-500">
          ({count})
        </span>
      )}

      {!editable && (
        <span className="text-xs text-gray-400">
          Login to rate
        </span>
      )}
    </div>
  );
}
