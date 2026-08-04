const activities = [
  "Nazeeb K completed profile successfully.",
  "Rahul Raj registered as a new candidate.",
  "Anjali applied for Frontend Developer.",
  "Sarah completed AI Screening Interview.",
  "John shortlisted for Backend Developer.",
];

function CandidateActivity() {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-semibold text-text-primary">
          Candidate Activity
        </h2>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          Live
        </span>

      </div>

      <div className="space-y-4">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-gray-50 p-4 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20"
          >
            <p className="text-sm font-medium text-gray-700">
              {activity}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}

export default CandidateActivity;