import {
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border bg-white px-8">

      {/* Left */}

      <div className="relative w-96">

        {/* <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
        />

        <input
          type="text"
          placeholder="Search companies, candidates..."
          className="h-11 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-primary"
        /> */}

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border transition hover:bg-background">

          <Bell
            size={20}
            className="text-text-secondary"
          />

          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-2">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">

            A

          </div>

          <div>

            <h3 className="text-sm font-semibold text-text-primary">
              Admin
            </h3>

            <p className="text-xs text-text-secondary">
              Super Administrator
            </p>

          </div>

          <ChevronDown
            size={18}
            className="text-text-secondary"
          />

        </div>

      </div>

    </header>
  );
}

export default DashboardNavbar;