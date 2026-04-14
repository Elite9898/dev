type TopbarProps = {
  welcomeText: string;
  title: string;
  notificationIcon: string;
  notificationLabel?: string;
  onNotificationClick?: () => void;
  userName: string;
  userRole: string;
};

function Topbar({
  welcomeText,
  title,
  notificationIcon,
  notificationLabel = "Powiadomienia",
  onNotificationClick,
  userName,
  userRole,
}: TopbarProps) {
  return (
    <header className="sd-panel mb-6 flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-sm text-white/55">{welcomeText}</p>
        <h2 className="truncate text-2xl font-semibold tracking-tight sm:text-[1.65rem]">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:ml-auto">
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/7 text-violet-300 transition-all duration-200 hover:-translate-y-px hover:border-violet-300/35 hover:bg-violet-500/15 disabled:cursor-not-allowed disabled:text-white/45 disabled:hover:border-white/12 disabled:hover:bg-white/7"
          aria-label={notificationLabel}
          title={notificationLabel}
          onClick={onNotificationClick}
          disabled={!onNotificationClick}
        >
          {notificationIcon}
        </button>

        <div className="min-w-0 rounded-2xl border border-white/12 bg-white/7 px-4 py-2.5">
          <p className="truncate text-sm font-semibold">{userName}</p>
          <p className="truncate text-xs text-white/55">{userRole}</p>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
