function ApplicationLayout({ left, right }) {
  return (
    <div
      className="
        min-h-0
        lg:h-[calc(100vh-156px)]
      "
    >
      {/* Desktop Workspace */}
      <div
        className="
          hidden
          h-full
          min-h-0
          gap-5
          lg:grid
          lg:grid-cols-[minmax(320px,0.7fr)_minmax(0,1.5fr)]
        "
      >
        {/* Left - Jobs */}
        <section
          className="
            flex
            h-full
            min-h-0
            min-w-0
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-surface
          "
        >
          {left}
        </section>

        {/* Right - Applications */}
        <section
          className="
            flex
            h-full
            min-h-0
            min-w-0
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-surface
          "
        >
          {right}
        </section>
      </div>

      {/* Mobile / Tablet */}
      <div
        className="
          min-h-0
          lg:hidden
        "
      >
        <div className="space-y-5">
          {left}
          {right}
        </div>
      </div>
    </div>
  );
}

export default ApplicationLayout;