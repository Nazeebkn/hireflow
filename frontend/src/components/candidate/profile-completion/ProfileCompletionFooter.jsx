function ProfileCompletionFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-sm text-text-secondary md:flex-row">

        <p>
          © 2026 <span className="font-semibold text-primary">HireFlow</span>.
          All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <button className="transition hover:text-primary">
            Privacy Policy
          </button>

          <button className="transition hover:text-primary">
            Terms
          </button>

          <button className="transition hover:text-primary">
            Support
          </button>
        </div>

      </div>
    </footer>
  );
}

export default ProfileCompletionFooter;