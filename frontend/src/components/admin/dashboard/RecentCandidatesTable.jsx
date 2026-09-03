import { useEffect, useState } from "react";
import { Eye, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getCandidates } from "../../../services/admin/adminService";

function RecentCandidatesTable() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const data = await getCandidates("", 1);

      console.log("Recent Candidates:", data);

      // Latest 5 candidates only
      setCandidates(
        Array.isArray(data) ? data.slice(0, 3) : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch recent candidates:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-border p-6">

        <div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">

            <Users size={13} />

            Latest

          </span>

          <h2 className="mt-3 text-xl font-semibold text-text-primary">
            Recent Candidate Registrations
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Latest candidates registered on HireFlow.
          </p>

        </div>

      </div>

      {/* Candidates */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Candidate
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Location
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Registered
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Status
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-sm text-text-secondary"
                >
                  Loading recent candidates...
                </td>

              </tr>

            ) : candidates.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-sm text-text-secondary"
                >
                  No candidates registered yet.
                </td>

              </tr>

            ) : (

              candidates.map((candidate) => (

                <tr
                  key={candidate.id}
                  className="border-t border-border transition hover:bg-gray-50/70"
                >

                  {/* Candidate */}

                  <td className="px-6 py-5">

                    <div className="font-semibold text-text-primary">
                      {candidate.first_name}{" "}
                      {candidate.last_name}
                    </div>

                    {candidate.email && (
                      <div className="mt-1 text-xs text-text-secondary">
                        {candidate.email}
                      </div>
                    )}

                  </td>

                  {/* Location */}

                  <td className="px-6 py-5 text-sm text-text-secondary">
                    {candidate.location || "—"}
                  </td>

                  {/* Registered */}

                  <td className="px-6 py-5 text-sm text-text-secondary">

                    {candidate.created_at
                      ? new Date(
                          candidate.created_at
                        ).toLocaleDateString("en-GB")
                      : "—"}

                  </td>

                  {/* Status */}

                  <td className="px-6 py-5">

                    {candidate.is_active === false ? (

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">

                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                        Suspended

                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        Active

                      </span>

                    )}

                  </td>

                  {/* Action */}

                  <td className="px-6 py-5 text-center">

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/candidates/${candidate.id}`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                    >

                      <Eye size={17} />

                      View

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-end border-t border-border p-5">

        <button
          onClick={() =>
            navigate("/admin/candidates")
          }
          className="text-sm font-semibold text-primary transition hover:underline"
        >
          View All Candidates →
        </button>

      </div>

    </section>
  );
}

export default RecentCandidatesTable;