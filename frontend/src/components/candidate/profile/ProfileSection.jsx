function ProfileSection({
  title,
  description,
  icon,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">

      <div className="flex items-start gap-3 border-b border-border px-6 py-5">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text">
            {title}
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            {description}
          </p>
        </div>

      </div>

      <div className="p-6">
        {children}
      </div>

    </section>
  );
}

export default ProfileSection;