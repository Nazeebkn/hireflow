import { useEffect, useState } from "react";
import {
  Building2,
  LockKeyhole,
  Bell,
  Palette,
  ShieldCheck,
  MonitorSmartphone,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  Clock3,
} from "lucide-react";

import CompanyDashboardLayout from "../../../components/company/dashboard/CompanyDashboardLayout";
import ProfileInformationDrawer from "../../../components/company/settings/ProfileInformationDrawer";

import { getCompanyProfile } from "../../../services/company/companyService";

const settingsItems = [
  {
    title: "Profile Information",
    description:
      "Manage your company information and verification details.",
    icon: Building2,
    iconStyle: "bg-blue-50 text-blue-600",
    active: true,
  },
  {
    title: "Account Security",
    description:
      "Manage your password, email and account security.",
    icon: LockKeyhole,
    iconStyle: "bg-violet-50 text-violet-600",
    active: false,
  },
  {
    title: "Notification Preferences",
    description:
      "Choose how you want to receive company notifications.",
    icon: Bell,
    iconStyle: "bg-amber-50 text-amber-600",
    active: false,
  },
  {
    title: "Appearance",
    description:
      "Customize the appearance of your HireFlow workspace.",
    icon: Palette,
    iconStyle: "bg-pink-50 text-pink-600",
    active: false,
  },
  {
    title: "Privacy",
    description:
      "Manage your privacy and company visibility preferences.",
    icon: ShieldCheck,
    iconStyle: "bg-emerald-50 text-emerald-600",
    active: false,
  },
  {
    title: "Login Sessions",
    description:
      "View and manage devices currently signed in to your account.",
    icon: MonitorSmartphone,
    iconStyle: "bg-cyan-50 text-cyan-600",
    active: false,
  },
  {
    title: "Danger Zone",
    description:
      "Manage permanent and sensitive account actions.",
    icon: Trash2,
    iconStyle: "bg-red-50 text-red-600",
    active: false,
    danger: true,
  },
];

const CompanySettings = () => {
  const [companyProfile, setCompanyProfile] = useState(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const data = await getCompanyProfile();
      setCompanyProfile(data);
    } catch (error) {
      console.error("Failed to fetch company profile:", error);
    }
  };

  const handleCardClick = (item) => {
    if (!item.active) return;

    setIsProfileDrawerOpen(true);
  };

  return (
    <CompanyDashboardLayout
      title="Settings"
      subtitle="Manage your company account, preferences and security."
      companyProfile={companyProfile}
    >
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <span>Company</span>

          <ChevronRight size={15} />

          <span className="text-slate-700">
            Settings
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your company account, preferences and security.
        </p>
      </div>

      {/* Main Settings Layout */}
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]">

        {/* Settings Cards */}
        <section>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

            {settingsItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  type="button"
                  disabled={!item.active}
                  onClick={() => handleCardClick(item)}
                  className={`group w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition-all duration-200 ${
                    item.active
                      ? "cursor-pointer border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                      : "cursor-not-allowed border-slate-200 opacity-75"
                  }`}
                >
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-4">

                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        item.danger
                          ? "bg-red-50 text-red-600"
                          : item.iconStyle
                      }`}
                    >
                      <Icon
                        size={21}
                        strokeWidth={2}
                      />
                    </div>

                    {/* Status */}
                    {item.active ? (
                      <ChevronRight
                        size={19}
                        className="mt-1 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-500"
                      />
                    ) : (
                      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                        <Clock3 size={12} />
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="mt-5">
                    <h2
                      className={`text-[15px] font-semibold ${
                        item.danger
                          ? "text-red-700"
                          : "text-slate-900"
                      }`}
                    >
                      {item.title}
                    </h2>

                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}

          </div>
        </section>

        {/* Right Sidebar Widgets */}
        <aside className="space-y-4">

          {/* Profile Completion */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Profile Completion
                </h3>

                <p className="text-xs text-slate-500">
                  Company profile status
                </p>
              </div>

            </div>

            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Completion
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  —
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-0 rounded-full bg-blue-600" />
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Complete your company information to improve your profile.
              </p>

            </div>
          </div>

          {/* Account Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h3 className="text-sm font-semibold text-slate-900">
              Account Overview
            </h3>

            <div className="mt-4 divide-y divide-slate-100">

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">
                  Verification
                </span>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {companyProfile?.approval_status || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">
                  Company
                </span>

                <span className="max-w-[160px] truncate text-right text-sm font-medium text-slate-700">
                  {companyProfile?.company_name || "—"}
                </span>
              </div>

            </div>
          </div>

          {/* Quick Tip */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                <Lightbulb size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Quick Tip
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  Keep your company information up to date so candidates
                  can better understand your organization.
                </p>
              </div>

            </div>
          </div>

        </aside>
      </div>

      {/* Profile Information Drawer */}
      <ProfileInformationDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
      />
    </CompanyDashboardLayout>
  );
};

export default CompanySettings;