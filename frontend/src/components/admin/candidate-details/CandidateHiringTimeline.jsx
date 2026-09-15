import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Flag,
  UserRound,
} from "lucide-react";

function CandidateHiringTimeline({
  candidate,
}) {
  const timeline =
    candidate?.hiring_timeline ||
    candidate?.timeline ||
    [];

  const events = Array.isArray(timeline)
    ? timeline
    : [];

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">

      {/* HEADER */}

      <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-5 py-4 sm:px-6">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-primary">
          <Clock3 size={19} />
        </div>

        <div>

          <h2 className="text-sm font-bold text-text sm:text-base">
            Hiring Timeline
          </h2>

          <p className="mt-0.5 text-xs text-text-secondary">
            Track the candidate's hiring journey.
          </p>

        </div>

      </div>


      {/* TIMELINE */}

      <div className="p-5 sm:p-7">

        {events.length > 0 ? (
          <div className="relative">

            <div className="absolute bottom-4 left-5 top-4 w-px bg-blue-100" />

            <div className="space-y-7">

              {events.map(
                (event, index) => (
                  <TimelineItem
                    key={
                      event.id ||
                      `${event.status}-${index}`
                    }
                    event={event}
                    isLast={
                      index ===
                      events.length - 1
                    }
                  />
                )
              )}

            </div>

          </div>
        ) : (
          <EmptyTimelineState />
        )}

      </div>

    </section>
  );
}


/* =====================================================
   TIMELINE ITEM
===================================================== */

function TimelineItem({
  event,
  isLast,
}) {
  const status =
    event?.status ||
    event?.title ||
    "Hiring Stage";

  const description =
    event?.description ||
    event?.message ||
    "No additional information available.";

  const date =
    event?.date ||
    event?.created_at ||
    event?.timestamp;

  return (
    <div className="relative flex gap-4">

      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-primary shadow-sm">

        <CheckCircle2 size={17} />

      </div>

      <div className="min-w-0 flex-1 pb-1">

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

          <h3 className="text-sm font-bold text-text">
            {formatStatus(status)}
          </h3>

          {date && (
            <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">

              <CalendarDays size={13} />

              {formatDate(date)}

            </span>
          )}

        </div>

        <p className="mt-1.5 text-sm leading-6 text-text-secondary">
          {description}
        </p>

      </div>

    </div>
  );
}


/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyTimelineState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50/30 px-6 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-primary">
        <Clock3 size={27} />
      </div>

      <h3 className="mt-4 text-base font-bold text-text">
        No hiring timeline available
      </h3>

      <p className="mt-1.5 max-w-md text-sm leading-6 text-text-secondary">
        Hiring activity will appear here once application
        status history is available.
      </p>

    </div>
  );
}


/* =====================================================
   FORMAT STATUS
===================================================== */

function formatStatus(value) {
  return String(value || "Hiring Stage")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export default CandidateHiringTimeline;