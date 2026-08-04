const activities = [
  "OpenAI submitted company profile.",
  "TechNova registered successfully.",
  "CloudX uploaded verification document.",
  "ABC Solutions profile approved.",
  "XYZ Technologies profile rejected.",
];

function DashboardActivity() {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">
            Recent Activity
        </h2>

        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Live
        </span>
        </div>

      <div className="mt-6 space-y-4">

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

export default DashboardActivity;