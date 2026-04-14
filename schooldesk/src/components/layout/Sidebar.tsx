import Button from "../ui/Button";

export type SidebarTab =
  | "Dashboard"
  | "Tasks"
  | "Exams"
  | "Schedule"
  | "Focus"
  | "Notes";

type SidebarProps = {
  logoInitial: string;
  appName: string;
  subtitle: string;
  navItems: SidebarTab[];
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onStartSessionClick?: () => void;
};

const tabLabelMap: Record<SidebarTab, string> = {
  Dashboard: "Panel główny",
  Tasks: "Zadania",
  Exams: "Sprawdziany",
  Schedule: "Plan lekcji",
  Focus: "Tryb skupienia",
  Notes: "Notatki",
};

function Sidebar({
  logoInitial,
  appName,
  subtitle,
  navItems,
  activeTab,
  onTabChange,
  onStartSessionClick,
}: SidebarProps) {
  return (
    <aside className="w-full border-b border-white/12 bg-white/6 shadow-lg shadow-black/15 backdrop-blur-xl lg:w-64 lg:border-r lg:border-b-0">
      <div className="flex h-full flex-col p-4 lg:p-5">
        <div className="mb-4 lg:mb-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/20 text-xl font-bold text-violet-300 ring-1 ring-violet-300/20">
              {logoInitial}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold">{appName}</h1>
              <p className="truncate text-sm text-white/50">{subtitle}</p>
            </div>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onTabChange(item)}
              className={`group min-w-0 shrink-0 overflow-hidden rounded-2xl px-4 py-2.5 text-left text-sm font-medium whitespace-nowrap text-ellipsis transition-all duration-200 lg:flex lg:w-full lg:items-center lg:py-3 ${
                item === activeTab
                  ? "bg-violet-500 text-white shadow-lg shadow-violet-900/35 ring-1 ring-violet-300/35"
                  : "text-white/72 hover:-translate-y-px hover:bg-white/10 hover:text-white"
              }`}
              title={tabLabelMap[item]}
            >
              <span className="block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {tabLabelMap[item]}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-4 rounded-3xl border border-white/14 bg-linear-to-br from-violet-500/20 to-fuchsia-500/10 p-4 shadow-lg shadow-black/20 lg:mt-auto">
          <p className="min-w-0 text-sm font-semibold">Tryb skupienia</p>
          <p className="mt-1 text-sm text-white/60">
            Skup się na jednym zadaniu i rozpocznij sesję.
          </p>
          <Button
            className="mt-4 w-full whitespace-nowrap"
            variant="primary"
            size="sm"
            onClick={onStartSessionClick}
          >
            Rozpocznij sesję
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
