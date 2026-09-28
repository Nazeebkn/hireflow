import { X } from "lucide-react";
import CandidateProfile from "../../../pages/candidate/CandidateProfile";

function ProfileInformationDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-4xl flex-col border-l border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-text">
              Profile Information
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              View and manage your candidate profile information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-background hover:text-text"
            aria-label="Close profile information"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <CandidateProfile embedded />
        </div>
      </aside>
    </div>
  );
}

export default ProfileInformationDrawer;