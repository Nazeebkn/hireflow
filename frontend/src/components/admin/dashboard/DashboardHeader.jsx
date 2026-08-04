function DashboardHeader() {
  return (
    <header className="mb-8 flex items-center justify-between">

      <div>

        <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          HireFlow Admin Portal
        </span>

        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          Welcome Back, Admin 👋
        </h1>

        <p className="mt-2 max-w-3xl text-gray-500">
          Manage company approvals, monitor recruitment
          activities and oversee the entire HireFlow platform.
        </p>

      </div>

    </header>
  );
}

export default DashboardHeader;