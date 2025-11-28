"use client";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      id: 1,
      title: "Basic",
      price: 25,
      period: "/day",
      description: "Ideal for city rides",
      features: [
        "Compact cars",
        "50 km/day limit",
        "Basic insurance",
        "24/7 roadside support",
        "Flexible cancellation",
      ],
      highlighted: false,
      gradient: "from-cyan-400 to-blue-400",
    },
    {
      id: 2,
      title: "Standard",
      price: 40,
      period: "/day",
      description: "Best for long trips",
      features: [
        "Sedan & SUV options",
        "Unlimited km",
        "Premium insurance",
        "Priority support",
        "Free driver available",
        "Fuel coverage",
      ],
      highlighted: true,
      gradient: "from-purple-400 to-pink-400",
    },
    {
      id: 3,
      title: "Premium",
      price: 70,
      period: "/day",
      description: "Includes luxury cars",
      features: [
        "Luxury & sports cars",
        "Unlimited km",
        "Full coverage insurance",
        "VIP 24/7 support",
        "Dedicated driver",
        "Airport pickup included",
      ],
      highlighted: false,
      gradient: "from-orange-400 to-red-400",
    },
  ];

  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      id="pricing"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 border border-purple-400/30 rounded-full px-4 py-2">
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider">
              Transparent Pricing
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">
            <span className="bg-gradient-to-r from-white via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Choose Your Perfect Plan
            </span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto text-balance font-medium">
            Flexible pricing designed to fit every budget. No hidden charges,
            just honest prices.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative group transition-transform duration-300 ${
                plan.highlighted ? "md:scale-105" : ""
              }`}
            >
              {/* Card background */}
              <div
                className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-slate-900/90 via-slate-800/60 to-slate-900/80 border-2 border-purple-400/60 shadow-2xl shadow-purple-500/20"
                    : "bg-gradient-to-br from-slate-900/80 via-slate-800/40 to-slate-900/60 border border-cyan-400/20 group-hover:border-cyan-400/50"
                }`}
              ></div>

              {/* Hover gradient overlay */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                    : "bg-gradient-to-br from-cyan-500/5 to-blue-500/5"
                }`}
              ></div>

              {/* Highlighted badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-slate-950 px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="relative p-8 flex flex-col h-full space-y-6">
                {/* Header */}
                <div className="space-y-3">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">
                    {plan.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-5xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}
                    >
                      ${plan.price}
                    </span>
                    <span className="text-slate-400 text-lg">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
                          plan.highlighted
                            ? "bg-gradient-to-r from-purple-400 to-pink-400"
                            : "bg-gradient-to-r from-cyan-400 to-blue-400"
                        }`}
                      >
                        <Check
                          className="w-3 h-3 text-slate-950"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-slate-300 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/40 hover:from-cyan-500/30 hover:to-blue-500/30"
                    }`}
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center mt-16">
          <p className="text-slate-400 text-sm">
            All plans include tax and fees. No subscription required. Cancel
            anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
