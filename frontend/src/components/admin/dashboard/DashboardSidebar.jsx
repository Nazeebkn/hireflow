import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Building,
  Users,
  CreditCard,
  Settings,
} from "lucide-react";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    label: "Pending Companies",
    icon: Building2,
    path: "/admin/pending-companies",
  },
  {
    label: "Companies",
    icon: Building,
    path: "/admin/companies",
  },
  {
    label: "Candidates",
    icon: Users,
    path: "/admin/candidates",
  },
  {
    label: "Subscriptions",
    icon: CreditCard,
    path: "/admin/subscriptions",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

function DashboardSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 border-r border-border bg-surface">

      <div className="border-b border-border p-6">
        <h1 className="text-2xl font-bold text-primary">
          HireFlow
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Admin Portal
        </p>
      </div>

      <nav className="p-4 space-y-2">

        {sidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-background"
                }`
              }
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.label}
              </span>
            </NavLink>
          );
        })}

      </nav>

    </aside>
  );
}

export default DashboardSidebar;