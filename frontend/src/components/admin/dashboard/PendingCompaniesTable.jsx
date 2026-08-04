import { Eye } from "lucide-react";

const pendingCompanies = [
  {
    id: 1,
    company_name: "OpenAI",
    industry: "Artificial Intelligence",
    submitted_on: "04 Aug 2026",
    status: "PENDING",
  },
  {
    id: 2,
    company_name: "TechNova",
    industry: "Software",
    submitted_on: "03 Aug 2026",
    status: "PENDING",
  },
  {
    id: 3,
    company_name: "CloudX",
    industry: "Cloud Computing",
    submitted_on: "02 Aug 2026",
    status: "PENDING",
  },
];

function PendingCompaniesTable() {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              Needs Attention
            </span>

            <h2 className="mt-3 text-xl font-semibold text-text-primary">
              Pending Company Approvals
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Review newly registered companies awaiting approval.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Company
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Industry
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Submitted
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {pendingCompanies.map((company) => (
              <tr
                key={company.id}
                className="border-t border-border hover:bg-gray-50 transition"
              >
                <td className="px-6 py-5 font-medium">
                  {company.company_name}
                </td>

                <td className="px-6 py-5">{company.industry}</td>

                <td className="px-6 py-5">{company.submitted_on}</td>

                <td className="px-6 py-5">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Pending Review
                  </span>
                </td>

                <td className="px-6 py-5 text-center">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90">
                    <Eye size={18} />
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border p-5">
          <button className="text-sm font-semibold text-primary hover:underline">
            View All Pending Companies →
          </button>
        </div>
      </div>
    </section>
  );
}

export default PendingCompaniesTable;
