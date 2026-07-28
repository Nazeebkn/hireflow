import { ArrowRight } from "lucide-react";

function CTA() {
  return (
    <section className="bg-primary py-24">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
          GET STARTED
        </span>

        <h2 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl">
          Ready to Transform Your Hiring Process?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
          Streamline recruitment with AI-powered resume screening, intelligent
          interviews, and a modern applicant tracking system—all in one
          platform.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-xl bg-white px-8 py-4 font-semibold text-primary transition hover:scale-105">
            Start Free Trial
          </button>

          <button className="flex items-center justify-center gap-2 rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-primary">
            Contact Sales
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTA;