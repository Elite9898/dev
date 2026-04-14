type EmptyStateProps = {
  title: string;
  description: string;
  compact?: boolean;
};

function EmptyState({ title, description, compact = false }: EmptyStateProps) {
  return (
    <div
      className={`rounded-2xl border border-white/12 bg-black/28 text-center shadow-sm shadow-black/20 backdrop-blur-sm ${compact ? "px-4 py-4" : "px-6 py-8"}`}
    >
      <p className="text-sm font-semibold tracking-[0.03em] text-violet-200">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
    </div>
  );
}

export default EmptyState;
