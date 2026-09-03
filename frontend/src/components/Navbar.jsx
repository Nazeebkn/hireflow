import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import FullScreenLoader from "../components/common/FullScreenLoader";

function Navbar() {
  const [active, setActive] = useState("home");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const navItem = (id, label) => (
    <a
      href={`#${id}`}
      className={`font-medium transition-colors duration-300 ${
        active === id
          ? "text-primary"
          : "text-text-secondary hover:text-primary"
      }`}
    >
      {label}
    </a>
  );

  

return (
  <>
    {loading && (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
        <h1 className="text-3xl font-bold text-primary">
          HireFlow
        </h1>

        <p className="mt-3 text-sm text-text-secondary">
          Loading login...
        </p>

        <div className="mt-8 h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    )}

    <nav className="flex items-center justify-between border-b border-border bg-surface px-8 py-4">

      <div>
        <h1 className="text-2xl font-bold text-primary">
          HireFlow
        </h1>
      </div>

      <ul className="hidden items-center gap-8 md:flex">
        {navItem("home", "Home")}
        {navItem("features", "Features")}
        {navItem("pricing", "Pricing")}
        {navItem("about", "About")}
      </ul>

      <div className="hidden items-center gap-3 md:flex">
        <button
          onClick={() => {
            setLoading(true);

            setTimeout(() => {
              navigate("/login");
            }, 500);
          }}
          className="rounded-lg border border-border px-5 py-2"
        >
          Login
        </button>

        <button className="rounded-lg bg-primary px-5 py-2 text-white">
          Get Started
        </button>
      </div>

    </nav>
  </>
);
}

export default Navbar;