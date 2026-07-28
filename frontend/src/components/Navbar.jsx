import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [active, setActive] = useState("home");
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
    <li>
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
    </li>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

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
            onClick={() => navigate("/login")}
            className="rounded-lg border border-border px-5 py-2"
          >
            Login
          </button>
          <button className="rounded-lg bg-primary px-5 py-2 text-white">
            Get Started
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;