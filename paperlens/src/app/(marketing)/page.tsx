import UploadCard from "@/components/UploadCard";
import AuthButton from "@/components/AuthButton";

const steps = [
  {
    number: "1",
    title: "Upload a paper",
    description: "Drop a PDF, paste a DOI link, or paste the raw text.",
  },
  {
    number: "2",
    title: "AI analyzes in 60 seconds",
    description:
      "Our models read, extract, and assess the paper for you.",
  },
  {
    number: "3",
    title: "Get a structured intelligence report",
    description:
      "Summary, key findings, methodology review, and actionable takeaways.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Try it out",
    features: ["3 papers per month", "Full analysis reports", "PDF & text input"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For researchers & professionals",
    features: [
      "50 papers per month",
      "Priority processing",
      "DOI auto-fetch",
      "Export reports",
    ],
    cta: "Start Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/seat/month",
    description: "For labs & organizations",
    features: [
      "Unlimited papers",
      "Team dashboard",
      "API access",
      "Shared report library",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <span className="text-lg font-bold text-white">PaperLens</span>
        <AuthButton />
      </nav>

      {/* Hero */}
      <section className="section-animate px-6 pt-12 pb-16 md:pt-24 md:pb-24 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-accent/10 text-accent text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          AI-powered paper analysis
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
          Read any paper in{" "}
          <span className="text-accent">60 seconds</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          AI-powered scientific paper analysis for busy professionals
        </p>
        <a
          href="#try"
          className="inline-block mt-8 bg-accent hover:bg-accent-hover text-white font-semibold py-3.5 px-8 rounded-lg transition-all text-lg"
        >
          Try Free &mdash; No signup required
        </a>
      </section>

      {/* Upload / Try Section */}
      <section
        id="try"
        className="section-animate px-6 py-16 md:py-24 max-w-4xl mx-auto"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
          Analyze a paper now
        </h2>
        <UploadCard />
      </section>

      {/* How It Works */}
      <section className="section-animate px-6 py-16 md:py-24 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-14">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="text-center md:text-left"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent font-bold text-lg mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="section-animate px-6 py-16 md:py-24 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
          Simple pricing
        </h2>
        <p className="text-slate-400 text-center mb-14 max-w-lg mx-auto">
          Start free. Upgrade when you need more.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 md:p-8 border transition-all ${
                plan.highlighted
                  ? "bg-accent/5 border-accent shadow-lg shadow-accent/10 scale-[1.02]"
                  : "bg-navy-light border-navy-lighter"
              }`}
            >
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <span className="text-accent mt-0.5">&#10003;</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  plan.highlighted
                    ? "bg-accent hover:bg-accent-hover text-white"
                    : "bg-navy-lighter hover:bg-navy text-white border border-navy-lighter"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="section-animate border-t border-navy-lighter px-6 py-10 mt-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>Built by PaperLens</span>
          <a href="#" className="hover:text-slate-300 transition">
            About
          </a>
        </div>
      </footer>
    </main>
  );
}
