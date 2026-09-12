"use client";

import { motion } from "framer-motion";
import { CarFront, Clock3, Layers3, Route } from "lucide-react";

const stats = [
  {
    value: "10+",
    label: "Vehicles",
    description: "Ready for your next journey",
    icon: CarFront,
  },
  {
    value: "5",
    label: "Categories",
    description: "From city cars to luxury",
    icon: Layers3,
  },
  {
    value: "24/7",
    label: "Availability",
    description: "Book whenever you need",
    icon: Clock3,
  },
  {
    value: "1",
    label: "Simple experience",
    description: "From search to the road",
    icon: Route,
  },
];

const TrustStats = () => {
  return (
    <section className="border-t border-white/[0.06] bg-[#09090B]">
      <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col gap-5 border-b border-white/[0.08] pb-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#D4AF5A]" />

              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF5A]">
                RideNow at a glance
              </p>
            </div>

            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Everything you need.
              <span className="text-zinc-500"> Nothing you don't.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-zinc-500">
            A focused rental experience designed around finding the right car
            and getting on the road.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.25,
                }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`group relative border-b border-white/[0.08] p-7 sm:p-8 lg:border-b-0 ${
                  index !== 3 ? "lg:border-r" : ""
                }`}
              >
                {/* Icon */}
                <div className="flex h-10 w-10 items-center justify-center border border-white/[0.1] bg-[#111113] text-zinc-500 transition-colors duration-300 group-hover:border-[#D4AF5A]/40 group-hover:text-[#D4AF5A]">
                  <Icon size={17} strokeWidth={1.6} />
                </div>

                {/* Number */}
                <p className="mt-10 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                  {stat.value}
                </p>

                {/* Label */}
                <p className="mt-3 text-sm font-medium text-zinc-300">
                  {stat.label}
                </p>

                {/* Description */}
                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  {stat.description}
                </p>

                {/* Hover line */}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-[#D4AF5A] transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 flex items-center gap-4"
        >
          <span className="h-px w-12 bg-[#D4AF5A]/50" />

          <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">
            Focused on the journey
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustStats;
