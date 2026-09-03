import heroImage from "../assets/hero-imagee.png";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-8 py-20 lg:grid-cols-2">

        {/* Left Content */}
        <div className="max-w-xl">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-accent">
            AI Powered Recruitment Platform
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-text sm:text-5xl lg:text-6xl">
            Hire Smarter
            <br />
            With AI
          </h1>

          <p className="mt-6 text-base leading-8 text-text-secondary sm:text-lg">
            Streamline recruitment with AI Resume Screening, AI Interviews,
            and an intelligent Applicant Tracking System.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">

            {/* Get Started */}
            <button
              onClick={() => navigate("/signup")}
              className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-hover sm:w-auto"
            >
              Get Started
            </button>

            {/* Learn More */}
            <a
              href="#features"
              className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 font-medium text-text transition-all duration-200 hover:bg-background sm:w-auto"
            >
              Learn More
            </a>

          </div>
        </div>

        {/* Right Content */}
        <div className="flex items-center justify-center">
          <img
            src={heroImage}
            alt="HireFlow Hero"
            className="w-full max-w-3xl object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;