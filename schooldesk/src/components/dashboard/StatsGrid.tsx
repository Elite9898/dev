export type StatItem = {
  title: string;
  value: string;
  change: string;
};

type StatsGridProps = {
  stats: StatItem[];
};

function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-5 2xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.title} className="sd-panel px-5 py-5 sm:px-6 sm:py-5">
          <p className="text-sm font-medium tracking-[0.01em] text-white/60">
            {stat.title}
          </p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <h3 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">
              {stat.value}
            </h3>
            <span className="sd-badge shrink-0 border-emerald-400/20 bg-emerald-500/15 text-emerald-200">
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}

export default StatsGrid;
