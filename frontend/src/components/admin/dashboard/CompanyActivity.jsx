import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

import { getCompanies } from "../../../services/admin/adminService";

function DashboardActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const companiesData = await getCompanies(
        "",
        "",
        1,
      );

      const companies = Array.isArray(
        companiesData,
      )
        ? companiesData
        : companiesData?.results || [];

      console.log(
        "Dashboard Activity Companies:",
        companies,
      );

      const companyActivities = companies.map(
        (company) => {
          let message;
          let type;
          let Icon;

          switch (company.approval_status) {
            case "APPROVED":
              message = `${company.company_name} profile approved.`;
              type = "approved";
              Icon = CheckCircle2;
              break;

            case "REJECTED":
              message = `${company.company_name} profile rejected.`;
              type = "rejected";
              Icon = XCircle;
              break;

            case "PENDING":
            default:
              message = `${company.company_name} submitted company profile.`;
              type = "pending";
              Icon = Clock3;
              break;
          }

          return {
            id: company.id,
            companyName: company.company_name,
            message,
            type,
            icon: Icon,
            date: company.created_at,
          };
        },
      );

      // Newest first
      companyActivities.sort(
        (a, b) =>
          new Date(b.date || 0) -
          new Date(a.date || 0),
      );

      // ONLY LATEST 4
      setActivities(
        companyActivities.slice(0, 4),
      );
    } catch (error) {
      console.error(
        "Failed to fetch company activities:",
        error,
      );

      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-4 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold text-text-primary">
            Recent Activity
          </h2>

          <p className="mt-0.5 text-xs text-text-secondary">
            Latest company activity on HireFlow.
          </p>

        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">

          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          Live

        </span>

      </div>

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading ? (

        <div className="flex min-h-[190px] items-center justify-center">

          <div className="flex flex-col items-center gap-2">

            <div className="h-7 w-7 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

            <p className="text-xs text-text-secondary">
              Loading activity...
            </p>

          </div>

        </div>

      ) : activities.length === 0 ? (

        /* ================================================= */
        /* EMPTY STATE */
        /* ================================================= */

        <div className="flex min-h-[190px] flex-col items-center justify-center text-center">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">

            <Building2
              size={19}
              className="text-gray-400"
            />

          </div>

          <p className="mt-2 text-sm font-semibold text-text-primary">
            No company activity
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            Company activity will appear here.
          </p>

        </div>

      ) : (

        /* ================================================= */
        /* ACTIVITY LIST */
        /* ================================================= */

        <div className="space-y-2.5">

          {activities.map((activity) => {

            const Icon = activity.icon;

            return (
              <div
                key={activity.id}
                className="group flex items-center gap-3 rounded-xl border border-border bg-gray-50/70 px-3 py-3 transition-all duration-200 hover:border-primary/20 hover:bg-primary/5"
              >

                {/* ICON */}

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${
                    activity.type ===
                    "approved"
                      ? "bg-emerald-100 text-emerald-600 ring-emerald-200"
                      : activity.type ===
                          "rejected"
                        ? "bg-red-100 text-red-600 ring-red-200"
                        : "bg-amber-100 text-amber-600 ring-amber-200"
                  }`}
                >

                  <Icon size={16} />

                </div>

                {/* CONTENT */}

                <div className="min-w-0 flex-1">

                  <p className="truncate text-xs font-semibold text-text-primary">

                    {activity.message}

                  </p>

                  {activity.date && (
                    <p className="mt-0.5 text-[10px] text-text-secondary">

                      {new Date(
                        activity.date,
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}

                      {" • "}

                      {new Date(
                        activity.date,
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}

                    </p>
                  )}

                </div>

                {/* STATUS */}

                <span
                  className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold sm:inline-flex ${
                    activity.type ===
                    "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : activity.type ===
                          "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >

                  {activity.type ===
                  "approved"
                    ? "Approved"
                    : activity.type ===
                        "rejected"
                      ? "Rejected"
                      : "Pending"}

                </span>

              </div>
            );
          })}

        </div>

      )}

    </section>
  );
}

export default DashboardActivity;