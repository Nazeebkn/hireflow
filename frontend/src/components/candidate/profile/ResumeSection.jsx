import { FileText, Upload, ExternalLink } from "lucide-react";

function ResumeSection({
  resume,
  editing,
  resumeUploading,
  handleResumeChange,
  ProfileSection,
}) {
  const resumeUrl =
    typeof resume === "string" ? resume : resume?.url || "";

  const resumeName =
    typeof resume === "string"
      ? resume.split("/").pop()
      : resume?.name || "Resume";

  return (
    <ProfileSection
      title="Resume"
      description="Keep your latest resume available for employers."
      icon={<FileText size={20} />}
    >
      <div className="space-y-4">
        {resumeUrl ? (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                <FileText size={20} className="text-gray-500" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {resumeName}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Current resume
                </p>
              </div>
            </div>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-blue-600"
            >
              <ExternalLink size={15} />
              View
            </a>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 px-5 py-8 text-center">
            <FileText
              size={28}
              className="mx-auto text-gray-400"
            />

            <p className="mt-3 text-sm text-gray-500">
              No resume uploaded yet.
            </p>
          </div>
        )}

        {editing && (
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 ${
              resumeUploading
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            <Upload size={17} />

            {resumeUploading
              ? "Uploading..."
              : resumeUrl
              ? "Replace Resume"
              : "Upload Resume"}

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              disabled={resumeUploading}
              className="hidden"
            />
          </label>
        )}

        <p className="text-xs text-gray-400">
          Accepted formats: PDF, DOC, DOCX. Maximum size: 5 MB.
        </p>
      </div>
    </ProfileSection>
  );
}

export default ResumeSection;