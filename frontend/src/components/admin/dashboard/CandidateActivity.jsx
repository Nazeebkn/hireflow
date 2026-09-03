import { useEffect, useState } from "react";
import {
  UserRound,
  UserCheck,
  UserX,
} from "lucide-react";

import { getCandidates } from "../../../services/admin/adminService";

function CandidateActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const candidatesData = await getCandidates("", 1);

      const candidates = Array.isArray(candidatesData)
        ? candidatesData
        : candidatesData?.results || [];

      console.log(
        "Candidate Activity:",
        candidates,
      );

      const candidateActivities = candidates.map(
        (candidate) => {
          const fullName =
            `${candidate.first_name || ""} ${
              candidate.last_name || ""
            }`.trim();

          const isActive =
            candidate.is_active === true;

          return {
            id: candidate.id,
            name: fullName || "Candidate",
            message: `${
              fullName || "Candidate"
            } registered as a new candidate.`,
            date: candidate.created_at,
            isActive,
          };
        },
      );

      // Newest candidates first
      candidateActivities.sort(
        (a, b) =>
          new Date(b.date || 0) -
          new Date(a.date || 0),
      );

      // Only latest 4 candidates
      setActivities(
        candidateActivities.slice(0, 4),
      );
    } catch (error) {
      console.error(
        "Failed to fetch candidate activity:",
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
            Candidate Activity
          </h2>

          <p className="mt-0.5 text-xs text-text-secondary">
            Latest candidate activity on HireFlow.
          </p>

        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">

          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

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
              Loading candidate activity...
            </p>

          </div>

        </div>

      ) : activities.length === 0 ? (

        /* ================================================= */
        /* EMPTY STATE */
        /* ================================================= */

        <div className="flex min-h-[190px] flex-col items-center justify-center text-center">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">

            <UserRound
              size={19}
              className="text-gray-400"
            />

          </div>

          <p className="mt-2 text-sm font-semibold text-text-primary">
            No candidate activity
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            Candidate registrations will appear here.
          </p>

        </div>

      ) : (

        /* ================================================= */
        /* ACTIVITY LIST */
        /* ================================================= */

        <div className="space-y-2.5">

          {activities.map((activity) => (

            <div
              key={activity.id}
              className="group flex items-center gap-3 rounded-xl border border-border bg-gray-50/70 px-3 py-3 transition-all duration-200 hover:border-primary/20 hover:bg-primary/5"
            >

              {/* ICON */}

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${
                  activity.isActive
                    ? "bg-blue-100 text-blue-600 ring-blue-200"
                    : "bg-red-100 text-red-600 ring-red-200"
                }`}
              >

                {activity.isActive ? (
                  <UserCheck size={16} />
                ) : (
                  <UserX size={16} />
                )}

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
                  activity.isActive
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {activity.isActive
                  ? "Active"
                  : "Suspended"}
              </span>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}

export default CandidateActivity;