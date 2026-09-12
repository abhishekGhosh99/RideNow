"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Car, Headphones, Zap } from "lucide-react";

const features = [
  {
    number: "01",
    title: "A car for every journey",
    description:
      "Choose from a carefully selected range of vehicles, from efficient city cars to premium models.",
    icon: Car,
  },
  {
    number: "02",
    title: "Booking without the friction",
    description:
      "Select your destination, dates, and vehicle. Everything you need to get on the road is kept simple.",
    icon: Zap,
  },
  {
    number: "03",
    title: "Support that stays close",
    description:
      "Questions before or during your rental? Get the help you need without being left searching for answers.",
    icon: Headphones,
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="scroll-mt-24 w-full overflow-hidden bg-[#09090B] px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-[#D4AF5A]" />

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF5A]">
              Why RideNow
            </p>
          </div>

          <h2 className="mt-6 max-w-2xl text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl lg:text-[52px]">
            Everything you need.
            <br />
            Nothing you don't.
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
            A straightforward rental experience built around better cars,
            simpler booking, and support you can rely on.
          </p>
        </motion.div>

        {/* Feature list */}
        <div className="mt-16 border-t border-white/10">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative border-b border-white/10"
              >
                <div className="grid items-center gap-8 py-8 sm:py-10 lg:grid-cols-[80px_1fr_auto] lg:gap-12 lg:py-12">
                  {/* Number */}
                  <span className="text-xs font-medium tracking-[0.15em] text-zinc-600">
                    {feature.number}
                  </span>

                  {/* Main content */}
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
                    {/* Icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#111113] text-[#D4AF5A] transition-colors duration-200 group-hover:border-[#D4AF5A]/40 group-hover:bg-[#18181B]">
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-medium tracking-[-0.025em] text-white transition-colors duration-200 group-hover:text-[#E0BE70] sm:text-2xl">
                        {feature.title}
                      </h3>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden lg:flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-600 transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-[#D4AF5A]/40 group-hover:text-[#D4AF5A]">
                    <ArrowUpRight
                      className="h-4 w-4"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Hover line */}
                <div className="absolute bottom-[-1px] left-0 h-px w-0 bg-[#D4AF5A] transition-all duration-300 group-hover:w-full" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
