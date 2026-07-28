import { useState } from "react";
import { ChevronDown } from "lucide-react";

function FAQ() {
  const faqs = [
    {
      question: "How does AI Resume Screening work?",
      answer:
        "HireFlow analyzes candidate resumes using AI to match skills, experience, and qualifications with your job requirements, helping recruiters shortlist the most relevant applicants quickly.",
    },
    {
      question: "How does the AI Interview work?",
      answer:
        "Candidates attend an AI-powered screening interview where responses are evaluated automatically. The AI generates a detailed report to help recruiters make informed decisions.",
    },
    {
      question: "Can I upgrade my subscription at any time?",
      answer:
        "Yes. You can upgrade your subscription whenever your hiring needs grow. Your new plan will be applied immediately.",
    },
    {
      question: "Is candidate data secure?",
      answer:
        "Yes. HireFlow follows secure authentication and data protection practices to keep candidate and company information safe.",
    },
    {
      question: "Does HireFlow replace HR recruiters?",
      answer:
        "No. HireFlow automates resume screening and initial interviews, but the final hiring decision always remains with your HR team.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-accent">
            FAQ
          </span>

          <h2 className="mt-5 text-4xl font-bold text-text">
            Frequently Asked Questions
          </h2>

          <p className="mt-5 text-lg leading-8 text-text-secondary">
            Find answers to the most common questions about HireFlow and our
            AI-powered recruitment platform.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-background"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-lg font-semibold text-text">
                  {faq.question}
                </span>

                <ChevronDown
                  size={22}
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="border-t border-border px-6 py-5">
                  <p className="leading-7 text-text-secondary">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;