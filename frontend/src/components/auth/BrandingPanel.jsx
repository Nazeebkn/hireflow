import {
  Brain,
  Video,
  ChartColumnIncreasing,
} from "lucide-react";

import { BriefcaseBusiness } from "lucide-react";
import { Sparkles } from "lucide-react";
function BrandingPanel() {
  return (
    <div className="relative hidden lg:flex w-full flex-col bg-gradient-to-br from-[#F9FAFB] via-[#E8F1FF] to-[#CFE3FF] px-12 py-10">

      {/* Logo */}
      <div className="flex items-center gap-3">
<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md">
  <Sparkles size={24} className="text-primary" />
</div>
  <div>
    <h1 className="text-3xl font-bold text-primary">
      HireFlow
    </h1>

    <p className="text-sm text-text-secondary">
      AI-Powered Recruitment Platform
    </p>
  </div>
</div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center">
  <div className="max-w-lg">
        {/* <div className="max-w-md"> */}
        <h2 className="text-4xl font-bold leading-tight text-text-primary">
         Transform Hiring with AI
        </h2>

        <p className="mt-4 text-lg text-text-secondary">
          Simplify recruitment with intelligent resume screening, AI interviews, and data-driven hiring decisions.
        </p>

        {/* Dashboard Preview */}
        <div className="mt-10 space-y-4">

  <div className="group flex items-center gap-4 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-transform duration-300 group-hover:scale-110">
      <Brain size={22} className="text-primary" />
    </div>
    <div>
      <h3 className="font-semibold text-text-primary">
        AI Resume Screening
      </h3>
      <p className="text-sm text-text-secondary">
        Instantly analyze resumes with AI.
      </p>
    </div>
  </div>

  <div className="flex items-center gap-3 rounded-xl bg-white/80 p-4 shadow-sm">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-transform duration-300 group-hover:scale-110">
      <Video size={22} className="text-primary" />
    </div>
    <div>
      <h3 className="font-semibold text-text-primary">
        AI Video Interviews
      </h3>
      <p className="text-sm text-text-secondary">
        Conduct intelligent AI-powered interviews.
      </p>
    </div>
  </div>

  <div className="flex items-center gap-3 rounded-xl bg-white/80 p-4 shadow-sm">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-transform duration-300 group-hover:scale-110">
      <ChartColumnIncreasing
  size={22}
  className="text-primary"
/>
    </div>
    <div>
      <h3 className="font-semibold text-text-primary">
        Smart Hiring Insights
      </h3>
      <p className="text-sm text-text-secondary">
        Make faster and smarter hiring decisions.
      </p>
    </div>
  </div>

</div>
    </div>

      </div>

      {/* Footer */}
      <p className="text-sm text-text-secondary">
        <p className="text-center text-sm text-slate-500">
  Built for modern recruiters • © 2026 HireFlow
</p>
      </p>

    </div>
  );
}

export default BrandingPanel;