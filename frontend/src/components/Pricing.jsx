import { Check, Crown } from "lucide-react";

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "₹999",
      period: "/month",
      description: "Perfect for startups and small businesses.",
      button: "Get Started",
      featured: false,
      features: [
        "Up to 5 Active Jobs",
        "AI Resume Screening",
        "AI Interview",
        "Basic ATS Dashboard",
        "Email Support",
      ],
    },
    {
      name: "Professional",
      price: "₹2,999",
      period: "/month",
      description: "Best for growing companies hiring regularly.",
      button: "Start Free Trial",
      featured: true,
      features: [
        "Unlimited Jobs",
        "AI Resume Screening",
        "AI Interview",
        "Advanced Analytics",
        "Priority Support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solution for large organizations.",
      button: "Contact Sales",
      featured: false,
      features: [
        "Everything in Professional",
        "Custom Integrations",
        "Dedicated Account Manager",
        "Advanced Security",
        "Custom Onboarding",
      ],
    },
  ];

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-accent">
            PRICING
          </span>

          <h2 className="mt-5 text-4xl font-bold text-text">
            Simple Pricing for Every Business
          </h2>

          <p className="mt-5 text-lg leading-8 text-text-secondary">
            Choose a plan that fits your hiring needs and scale as your company
            grows.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                plan.featured
                  ? "border-primary bg-surface shadow-xl"
                  : "border-border bg-surface"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                  <Crown size={16} />
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-text">
                {plan.name}
              </h3>

              <p className="mt-2 text-text-secondary">
                {plan.description}
              </p>

              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-bold text-text">
                  {plan.price}
                </span>

                <span className="mb-1 text-text-secondary">
                  {plan.period}
                </span>
              </div>

              <button
                className={`mt-8 w-full rounded-xl px-6 py-3 font-semibold transition ${
                  plan.featured
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "border border-border hover:bg-gray-50"
                }`}
              >
                {plan.button}
              </button>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <Check
                      size={18}
                      className="text-success"
                    />

                    <span className="text-text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Pricing;