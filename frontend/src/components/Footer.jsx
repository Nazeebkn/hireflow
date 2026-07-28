import { FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-primary">
              HireFlow
            </h2>

            <p className="mt-5 max-w-md leading-7 text-text-secondary">
              HireFlow is an AI-powered recruitment platform that helps
              companies hire faster through AI resume screening, AI
              interviews, and an intelligent Applicant Tracking System.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="rounded-lg border border-border p-3 transition hover:bg-slate-100"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>

              <a
                href="#"
                className="rounded-lg border border-border p-3 transition hover:bg-slate-100"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>

              <a
                href="#"
                className="rounded-lg border border-border p-3 transition hover:bg-slate-100"
                aria-label="X (Twitter)"
              >
                <FaXTwitter size={20} />
              </a>

              <a
                href="mailto:info@hireflow.com"
                className="rounded-lg border border-border p-3 transition hover:bg-slate-100"
                aria-label="Email"
              >
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-text">
              Product
            </h3>

            <ul className="mt-5 space-y-3 text-text-secondary">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Workflow
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-text">
              Company
            </h3>

            <ul className="mt-5 space-y-3 text-text-secondary">
              <li>
                <a href="#" className="hover:text-primary transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-text">
              Legal
            </h3>

            <ul className="mt-5 space-y-3 text-text-secondary">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-text-secondary md:flex-row">
          <p>© 2026 HireFlow. All rights reserved.</p>

          <p>Powered by AI ❤️. Built for modern hiring.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;