import { Eye, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPendingCompanies } from "../../../services/admin/adminService";

function PendingCompaniesTable() {
  const navigate = useNavigate();

  const [pendingCompanies, setPendingCompanies] = useState([]);

  const fetchPendingCompanies = async () => {
    try {
      const data = await getPendingCompanies();

      console.log("Pending Companies:", data);

      setPendingCompanies(data);
    } catch (error) {
      console.error(
        "Failed to fetch pending companies:",
        error,
      );
    }
  };

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-border px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 ring-1 ring-amber-200">
            <AlertCircle size={19} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              Needs Attention
            </p>

            <h2 className="mt-0.5 text-lg font-semibold text-text-primary">
              Pending Company Approvals
            </h2>

            <p className="mt-0.5 text-xs text-text-secondary">
              Review newly registered companies awaiting approval.
            </p>
          </div>

        </div>

        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          {pendingCompanies.length} Pending
        </span>

      </div>

      {/* Table */}

      <div className="overflow-hidden">

        {pendingCompanies.length === 0 ? (

          <div className="flex min-h-[150px] items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-semibold text-text-primary">
                No pending companies
              </p>

              <p className="mt-1 text-xs text-text-secondary">
                All company applications have been reviewed.
              </p>
            </div>
          </div>

        ) : (

          <table className="w-full table-fixed">

            <thead className="bg-gray-50">

              <tr>

                <th className="w-[27%] px-5 py-3 text-left text-xs font-semibold text-gray-600">
                  Company
                </th>

                <th className="w-[22%] px-5 py-3 text-left text-xs font-semibold text-gray-600">
                  Industry
                </th>

                <th className="w-[18%] px-5 py-3 text-left text-xs font-semibold text-gray-600">
                  Submitted
                </th>

                <th className="w-[18%] px-5 py-3 text-left text-xs font-semibold text-gray-600">
                  Status
                </th>

                <th className="w-[15%] px-5 py-3 text-right text-xs font-semibold text-gray-600">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {pendingCompanies.map((company) => (

                <tr
                  key={company.id}
                  className="border-t border-border transition hover:bg-gray-50"
                >

                  <td className="px-5 py-3.5">

                    <p className="truncate text-sm font-semibold text-text-primary">
                      {company.company_name}
                    </p>

                  </td>

                  <td className="px-5 py-3.5">

                    <p className="truncate text-sm text-text-secondary">
                      {company.industry}
                    </p>

                  </td>

                  <td className="px-5 py-3.5">

                    <p className="text-sm text-text-secondary">
                      {new Date(
                        company.created_at,
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>

                  </td>

                  <td className="px-5 py-3.5">

                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                      Pending Review
                    </span>

                  </td>

                  <td className="px-5 py-3.5 text-right">

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/pending-companies/${company.id}`,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
                    >
                      <Eye size={15} />
                      Review
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

        {/* Footer */}

        {pendingCompanies.length > 0 && (
          <div className="flex items-center justify-end border-t border-border px-5 py-3">

            <button
              onClick={() =>
                navigate("/admin/pending-companies")
              }
              className="text-xs font-semibold text-primary transition hover:underline"
            >
              View All Pending Companies →
            </button>

          </div>
        )}

      </div>

    </section>
  );
}

export default PendingCompaniesTable;