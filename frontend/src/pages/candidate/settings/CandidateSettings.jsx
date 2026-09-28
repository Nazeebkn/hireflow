import { useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Bell,
  Palette,
  LockKeyhole,
  MonitorSmartphone,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";

import CandidateDashboardLayout from "../../../components/candidate/dashboard/CandidateDashboardLayout";
import ProfileInformationDrawer from "../../../components/candidate/settings/ProfileInformationDrawer";

function CandidateSettings() {
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  const settingsCards = [
    {
      title: "Profile Information",
      description:
        "Manage your personal, professional, education, experience, and skills information.",
      icon: UserRound,
    },
    {
      title: "Account Security",
      description:
        "Manage your password and keep your account secure.",
      icon: ShieldCheck,
    },
    {
      title: "Notification Preferences",
      description:
        "Choose which notifications and updates you want to receive.",
      icon: Bell,
    },
    {
      title: "Appearance",
      description:
        "Customize the appearance and display preferences of your account.",
      icon: Palette,
    },
    {
      title: "Privacy",
      description:
        "Control how your profile and information are visible to employers.",
      icon: LockKeyhole,
    },
    {
      title: "Login Sessions",
      description:
        "View and manage the devices and sessions connected to your account.",
      icon: MonitorSmartphone,
    },
    {
      title: "Danger Zone",
      description:
        "Manage account deletion and other irreversible account actions.",
      icon: Trash2,
      danger: true,
    },
  ];

  const handleSettingClick = (title) => {
    if (title === "Profile Information") {
      setIsProfileDrawerOpen(true);
    }
  };

  return (
    <CandidateDashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <section>
          <h1 className="text-3xl font-bold tracking-tight text-text">
            Settings
          </h1>

          <p className="mt-1.5 text-base text-text-secondary">
            Manage your account, preferences, privacy, and security.
          </p>
        </section>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Settings Cards */}
          <div className="space-y-4 xl:col-span-2">
            {settingsCards.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => handleSettingClick(item.title)}
                  className={`group flex w-full items-center gap-4 rounded-2xl border bg-surface p-5 text-left transition hover:shadow-sm ${
                    item.danger
                      ? "border-red-200 hover:border-red-300"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      item.danger
                        ? "bg-red-50 text-red-600"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon size={21} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h2
                      className={`text-base font-semibold ${
                        item.danger
                          ? "text-red-700"
                          : "text-text"
                      }`}
                    >
                      {item.title}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-text-secondary">
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    size={20}
                    className={`shrink-0 transition group-hover:translate-x-0.5 ${
                      item.danger
                        ? "text-red-400"
                        : "text-text-secondary"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="space-y-5">
            {/* Profile Completion */}
            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-text">
                    Profile Completion
                  </h2>

                  <p className="mt-1 text-sm text-text-secondary">
                    Keep your profile complete to improve your visibility to employers.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary">
                    Profile strength
                  </span>

                  <span className="text-sm font-semibold text-primary">
                    Complete your profile
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                  <div className="h-full w-3/4 rounded-full bg-primary" />
                </div>
              </div>
            </section>

            {/* Account Overview */}
            <section className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="text-base font-semibold text-text">
                Account Overview
              </h2>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    Account Type
                  </span>

                  <span className="text-sm font-medium text-text">
                    Candidate
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    Profile
                  </span>

                  <span className="text-sm font-medium text-emerald-600">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    Applications
                  </span>

                  <span className="text-sm font-medium text-text">
                    Manage from My Applications
                  </span>
                </div>
              </div>
            </section>

            {/* Quick Tip */}
            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Lightbulb size={20} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-text">
                    Quick Tip
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    Keep your profile, skills, education, and experience up to date so employers can get a better understanding of your background.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Profile Information Drawer */}
      <ProfileInformationDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
      />
    </CandidateDashboardLayout>
  );
}

export default CandidateSettings;