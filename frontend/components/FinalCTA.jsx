"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

const FinalCTA = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundX = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const headingY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/[0.06]"
    >
      {/* Large background typography */}
      <motion.div
        style={{ x: backgroundX }}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[18vw] font-semibold leading-none tracking-[-0.08em] text-white/[0.018] select-none"
      >
        DRIVE
      </motion.div>

      {/* Subtle vertical structure lines */}
      <div className="pointer-events-none absolute inset-y-0 left-[8%] w-px bg-white/[0.035]" />
      <div className="pointer-events-none absolute inset-y-0 right-[8%] w-px bg-white/[0.035]" />

      <div className="relative mx-auto max-w-[1440px] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="relative overflow-hidden border border-white/[0.08] bg-[#111113]">
          {/* Top accent */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 h-[2px] bg-[#D4AF5A]"
          />

          <div className="grid min-h-[360px] items-center gap-12 px-8 py-14 sm:px-12 lg:grid-cols-[1fr_auto] lg:px-16 lg:py-16">
            {/* Content */}
            <motion.div style={{ y: headingY }} className="relative max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6 }}
                className="mb-6 flex items-center gap-3"
              >
                <span className="h-px w-8 bg-[#D4AF5A]" />

                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF5A]">
                  Ready to drive?
                </p>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="max-w-xl text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl"
              >
                Find a car that fits your journey.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                }}
                className="mt-5 max-w-lg text-base leading-7 text-zinc-400"
              >
                Explore the RideNow fleet and choose the car that fits the road
                ahead.
              </motion.p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex lg:justify-end"
            >
              <Link
                href="/cars"
                className="group relative inline-flex h-14 items-center gap-3 overflow-hidden bg-[#D4AF5A] px-7 text-sm font-semibold text-[#09090B] transition-all duration-300 hover:bg-[#E0BE70]"
              >
                <span className="relative z-10">Browse cars</span>

                <ArrowUpRight
                  size={18}
                  strokeWidth={2}
                  className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />

                {/* Bottom hover line */}
                <span className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-[#09090B] transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </motion.div>
          </div>

          {/* Bottom metadata */}
          <div className="flex flex-col border-t border-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
            <div className="px-8 py-4 sm:px-12 lg:px-16">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                Your journey starts here
              </p>
            </div>

            <div className="border-t border-white/[0.06] px-8 py-4 sm:border-l sm:border-t-0 sm:px-12 lg:px-16">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                RideNow / 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
