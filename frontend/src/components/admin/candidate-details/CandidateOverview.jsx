import {
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserRound,
  UserCheck,
} from "lucide-react";

function CandidateOverview({ candidate }) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

      <div className="space-y-6 xl:col-span-8">

        {/* PERSONAL INFORMATION */}

        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <SectionHeader
            icon={UserRound}
            title="Personal Information"
            description="Basic identity and personal details"
          />

          <div className="grid grid-cols-1 gap-px bg-blue-100/60 sm:grid-cols-2">
            <InfoTile
              label="First Name"
              value={candidate?.first_name}
              icon={UserRound}
            />

            <InfoTile
              label="Last Name"
              value={candidate?.last_name}
              icon={UserRound}
            />

            <InfoTile
              label="Email"
              value={candidate?.email}
              icon={Mail}
            />

            <InfoTile
              label="Phone Number"
              value={candidate?.phone_number}
              icon={Phone}
            />

            <InfoTile
              label="Date of Birth"
              value={candidate?.date_of_birth}
              icon={CalendarDays}
            />

            <InfoTile
              label="Gender"
              value={candidate?.gender}
              icon={UserCheck}
            />

            <InfoTile
              label="Location"
              value={candidate?.location}
              icon={MapPin}
            />
          </div>
        </section>

        {/* PROFESSIONAL INFORMATION */}

        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <SectionHeader
            icon={BriefcaseBusiness}
            title="Professional Information"
            description="Career profile and online presence"
          />

          <div className="grid grid-cols-1 gap-px bg-blue-100/60 sm:grid-cols-2">
            <InfoTile
              label="Professional Headline"
              value={candidate?.headline}
              icon={BriefcaseBusiness}
              fullWidth
            />

            <SocialTile
              label="LinkedIn"
              value={candidate?.linkedin_url}
              icon={Globe}
            />

            <SocialTile
              label="GitHub"
              value={candidate?.github_url}
              icon={Code2}
            />

            <SocialTile
              label="Portfolio"
              value={candidate?.portfolio_url}
              icon={Globe}
            />
          </div>
        </section>

        {/* ABOUT */}

        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <SectionHeader
            icon={Sparkles}
            title="About Candidate"
            description="Personal introduction and professional summary"
          />

          <div className="bg-blue-50/30 p-6">
            {candidate?.about ? (
              <div className="rounded-xl border border-blue-100 bg-white p-5">
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-text-secondary">
                  {candidate.about}
                </p>
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="No information provided"
                description="The candidate has not added an introduction yet."
              />
            )}
          </div>
        </section>
      </div>

      {/* RIGHT */}

      <div className="space-y-6 xl:col-span-4">

        {/* RESUME */}

        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <SectionHeader
            icon={FileText}
            title="Resume"
            description="Candidate resume document"
          />

          <div className="p-5">
            {candidate?.resume ? (
              <a
                href={candidate.resume}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 transition hover:border-primary/30 hover:bg-blue-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-primary">
                    <FileText size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text">
                      Candidate Resume
                    </p>

                    <p className="mt-0.5 text-xs text-text-secondary">
                      Open resume
                    </p>
                  </div>
                </div>

                <ExternalLink
                  size={17}
                  className="shrink-0 text-primary"
                />
              </a>
            ) : (
              <EmptyState
                icon={FileText}
                title="Resume unavailable"
                description="No resume has been uploaded."
              />
            )}
          </div>
        </section>

        {/* CONTACT */}

        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <SectionHeader
            icon={Mail}
            title="Contact Details"
            description="Candidate contact information"
          />

          <div className="p-5">
            <ContactRow
              label="Email"
              value={candidate?.email}
              icon={Mail}
            />

            <ContactRow
              label="Phone"
              value={candidate?.phone_number}
              icon={Phone}
            />

            <ContactRow
              label="Location"
              value={candidate?.location}
              icon={MapPin}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-center gap-3 border-b border-blue-100 bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/40 px-5 py-4 sm:px-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-bold text-text sm:text-base">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}

function InfoTile({
  label,
  value,
  icon: Icon,
  fullWidth = false,
}) {
  return (
    <div
      className={`group bg-white p-5 transition hover:bg-blue-50/50 ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-primary ring-1 ring-blue-200 transition group-hover:bg-primary group-hover:text-white">
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {label}
          </p>

          <p className="mt-1.5 break-words text-sm font-semibold leading-6 text-text">
            {value || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}

function SocialTile({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="group bg-white p-5 transition hover:bg-blue-50/50">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-primary ring-1 ring-blue-200 transition group-hover:bg-primary group-hover:text-white">
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {label}
          </p>

          {value ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 flex items-start gap-1.5 break-all text-sm font-semibold leading-6 text-primary hover:underline"
            >
              <span className="break-all">{value}</span>
              <ExternalLink
                size={12}
                className="mt-1 shrink-0"
              />
            </a>
          ) : (
            <p className="mt-1.5 text-sm font-semibold text-text-secondary">
              Not provided
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-blue-50/50">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-primary">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-text">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/40 px-5 py-7 text-center">
      <Icon
        size={25}
        className="mx-auto text-primary/50"
      />

      <p className="mt-3 text-sm font-semibold text-text">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-text-secondary">
        {description}
      </p>
    </div>
  );
}

export default CandidateOverview;