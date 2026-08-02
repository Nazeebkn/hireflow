import { Sparkles } from "lucide-react";

function ProfileCompletionNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles
              size={18}
              className="text-primary"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold text-primary">
              HireFlow
            </h1>

            <p className="text-[11px] text-text-secondary">
              Candidate Profile Setup
            </p>
          </div>

        </div>

     

      </div>
    </header>
  );
}

export default ProfileCompletionNavbar;