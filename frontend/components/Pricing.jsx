"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: 1,
    title: "Essential",
    price: 2500,
    description: "For everyday city drives and short trips.",
    features: [
      "Compact & economy cars",
      "Up to 150 km/day",
      "Basic insurance coverage",
      "24/7 roadside assistance",
      "Flexible cancellation",
    ],
    highlighted: false,
  },
  {
    id: 2,
    title: "Comfort",
    price: 4500,
    description: "More comfort and flexibility for longer journeys.",
    features: [
      "Sedan & SUV options",
      "Up to 250 km/day",
      "Premium insurance coverage",
      "Priority customer support",
      "Flexible cancellation",
      "Additional driver option",
    ],
    highlighted: true,
  },
  {
    id: 3,
    title: "Executive",
    price: 7500,
    description: "A premium experience for special journeys.",
    features: [
      "Luxury & premium vehicles",
      "Up to 300 km/day",
      "Comprehensive coverage",
      "VIP customer support",
      "Additional driver included",
      "Airport pickup available",
    ],
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-t border-white/[0.06] bg-[#09090B] px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-12 max-w-3xl sm:mb-14"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#D4AF5A]" />

            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF5A]">
              Simple pricing
            </span>
          </div>

          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            Choose the way
            <span className="text-zinc-500"> you want to ride.</span>
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">
            Straightforward rental packages with no complicated subscriptions or
            hidden commitments.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -4,
              }}
              className={`relative flex flex-col overflow-hidden rounded-2xl border bg-[#111113] transition-colors duration-300 ${
                plan.highlighted
                  ? "border-[#D4AF5A]/50"
                  : "border-white/[0.08] hover:border-white/[0.16]"
              }`}
            >
              {/* Featured indicator */}
              {plan.highlighted && (
                <div className="flex items-center justify-between border-b border-[#D4AF5A]/20 bg-[#18181B] px-6 py-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4AF5A]">
                    Most popular
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF5A]" />
                </div>
              )}

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                {/* Plan Header */}
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                    {plan.title}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-zinc-500">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-7 border-y border-white/[0.07] py-6">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-semibold tracking-[-0.04em] ${
                        plan.highlighted ? "text-[#D4AF5A]" : "text-white"
                      }`}
                    >
                      ₹{plan.price.toLocaleString("en-IN")}
                    </span>

                    <span className="text-sm text-zinc-500">/ day</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6 flex-1">
                  <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                    Includes
                  </p>

                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            plan.highlighted
                              ? "bg-[#D4AF5A]"
                              : "border border-white/[0.12] bg-[#18181B]"
                          }`}
                        >
                          <Check
                            className={`h-3 w-3 ${
                              plan.highlighted
                                ? "text-[#09090B]"
                                : "text-zinc-500"
                            }`}
                            strokeWidth={3}
                          />
                        </span>

                        <span className="text-sm leading-5 text-zinc-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Link
                  href="/cars"
                  className={`group mt-8 flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-[#D4AF5A] text-[#09090B] hover:bg-[#E0BE70]"
                      : "border border-white/[0.1] bg-[#18181B] text-zinc-300 hover:border-[#D4AF5A]/40 hover:text-white"
                  }`}
                >
                  Explore cars
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-zinc-600">
            Prices shown are starting rates. Final rental cost depends on the
            vehicle, dates, and selected options.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
