import { Eye } from "lucide-react";

const candidates = [
  {
    id: 1,
    name: "Nazeeb K",
    role: "Frontend Developer",
    registered_on: "04 Aug 2026",
  },
  {
    id: 2,
    name: "Rahul Raj",
    role: "Backend Developer",
    registered_on: "03 Aug 2026",
  },
  {
    id: 3,
    name: "Anjali",
    role: "UI/UX Designer",
    registered_on: "02 Aug 2026",
  },
];

function RecentCandidatesTable() {
  return (
    <section className="rounded-2xl border border-border bg-surface shadow-sm">

      <div className="flex items-center justify-between border-b border-border p-6">

        <div>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            Latest
          </span>

          <h2 className="mt-3 text-xl font-semibold text-text-primary">
            Recent Candidate Registrations
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Recently registered candidates on HireFlow.
          </p>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Candidate
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Role
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Registered
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

            {candidates.map((candidate) => (
              <tr
                key={candidate.id}
                className="border-t border-border transition hover:bg-gray-50"
              >

                <td className="px-6 py-5 font-medium">
                  {candidate.name}
                </td>

                <td className="px-6 py-5">
                  {candidate.role}
                </td>

                <td className="px-6 py-5">
                  {candidate.registered_on}
                </td>

                <td className="px-6 py-5">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Registered
                  </span>
                </td>

                <td className="px-6 py-5 text-center">

                  <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90">

                    <Eye size={18} />

                    View

                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <div className="flex items-center justify-end border-t border-border p-5">

        <button className="text-sm font-semibold text-primary hover:underline">
          View All Candidates →
        </button>

      </div>

    </section>
  );
}

export default RecentCandidatesTable;