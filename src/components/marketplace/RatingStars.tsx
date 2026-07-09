interface Props {
  rating: number;
}

export default function RatingStars({ rating }: Props) {
  return (
    <div
      className="flex items-center gap-1 rounded-lg bg-surface-glass px-2 py-1 text-label-sm font-bold shadow-sm backdrop-blur-md"
      aria-label={`Rating: ${rating} out of 5`}
    >
      <span
        className="material-symbols-outlined text-[14px] text-primary"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        star
      </span>
      {rating.toFixed(1)}
    </div>
  );
}
