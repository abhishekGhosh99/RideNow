"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, CarFront, KeyRound, ArrowUpRight } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    icon: CalendarDays,
    title: "Choose your dates",
    description:
      "Tell us when and where you're heading. We'll show you the vehicles available for your trip.",
    label: "SEARCH",
  },
  {
    number: "02",
    icon: CarFront,
    title: "Find your car",
    description:
      "Compare vehicles by category, specifications, daily rate, and availability before making your choice.",
    label: "SELECT",
  },
  {
    number: "03",
    icon: KeyRound,
    title: "Book and drive",
    description:
      "Complete your booking, pick up your vehicle, and get on the road. It's that simple.",
    label: "DRIVE",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Header parallax
  const headingY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -70]);

  // Main image parallax
  const imageY = useTransform(scrollYProgress, [0, 0.5, 1], [-120, 0, 120]);

  // Image zoom
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.12, 1, 1.12],
  );

  // Caption moves independently
  const captionY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);

  // Decorative number movement
  const numberY = useTransform(scrollYProgress, [0, 0.5, 1], [-80, 0, 80]);

  // Timeline progress
  const lineScale = useTransform(scrollYProgress, [0.15, 0.8], [0, 1]);

  // Step group moves slightly slower
  const stepsY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#09090B]"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
        {/* Section Header */}
        <motion.div
          style={{ y: headingY }}
          className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
        >
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#D4AF5A]">
              How it works
            </p>

            <h2 className="max-w-xl text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              From search
              <br />
              to the open road.
            </h2>
          </div>

          <p className="max-w-lg text-base leading-7 text-zinc-400 lg:ml-auto">
            We've stripped the rental process down to what matters. Find the
            right car, make your booking, and start your journey without
            unnecessary steps.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="mt-20 grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          {/* IMAGE */}
          <div className="relative hidden lg:block">
            <div className="sticky top-32">
              <div className="relative h-[680px] overflow-hidden border border-white/[0.08] bg-[#111113]">
                {/* Parallax image */}
                <motion.div
                  style={{
                    y: imageY,
                    scale: imageScale,
                  }}
                  className="absolute inset-[-120px]"
                >
                  <img
                    src="/images/how-it-works.png"
                    alt="Car ready for a journey"
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                {/* Image darkness */}
                <div className="absolute inset-0 bg-black/25" />

                {/* Large background number */}
                <motion.div
                  style={{ y: numberY }}
                  className="absolute left-7 top-4 select-none"
                >
                  <span className="text-[180px] font-semibold leading-none tracking-[-0.1em] text-white/[0.08]">
                    01
                  </span>
                </motion.div>

                {/* Caption */}
                <motion.div
                  style={{ y: captionY }}
                  className="absolute bottom-8 left-8 right-8 border border-white/[0.12] bg-[#09090B]/90 p-6 backdrop-blur-md"
                >
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#D4AF5A]">
                        The RideNow process
                      </p>

                      <p className="mt-2 text-xl font-medium text-white">
                        Simple by design.
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/[0.12] text-[#D4AF5A]">
                      <ArrowUpRight size={18} strokeWidth={1.6} />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Image metadata */}
              <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                <span>RIDENOW / PROCESS</span>
                <span>03 STEPS</span>
              </div>
            </div>
          </div>

          {/* STEPS */}
          <motion.div style={{ y: stepsY }} className="relative">
            {/* Background timeline */}
            <div className="absolute bottom-0 left-[19px] top-0 w-px bg-white/[0.08]" />

            {/* Animated timeline */}
            <motion.div
              style={{ scaleY: lineScale }}
              className="absolute left-[19px] top-0 h-full w-px origin-top bg-[#D4AF5A]"
            />

            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon;

                // Each card gets a different parallax amount
                const cardY = useTransform(
                  scrollYProgress,
                  [0, 0.5, 1],
                  [35 + index * 25, 0, -35 - index * 25],
                );

                return (
                  <motion.div
                    key={step.number}
                    style={{ y: cardY }}
                    initial={{
                      opacity: 0,
                      x: 40,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.25,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative pl-14"
                  >
                    {/* Timeline node */}
                    <div className="absolute left-0 top-8 z-10 flex h-10 w-10 items-center justify-center border border-white/[0.12] bg-[#09090B] transition-all duration-300 group-hover:border-[#D4AF5A]/60 group-hover:bg-[#111113]">
                      <Icon
                        size={17}
                        strokeWidth={1.6}
                        className="text-zinc-500 transition-colors duration-300 group-hover:text-[#D4AF5A]"
                      />
                    </div>

                    {/* Card */}
                    <div className="relative overflow-hidden border border-white/[0.08] bg-[#111113] p-7 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/[0.16] group-hover:bg-[#141416] sm:p-9">
                      {/* Subtle moving number */}
                      <div className="absolute -right-4 -top-8 select-none">
                        <span className="text-[110px] font-semibold leading-none tracking-[-0.08em] text-white/[0.025]">
                          {step.number}
                        </span>
                      </div>

                      <div className="relative">
                        {/* Top row */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium tracking-[0.12em] text-[#D4AF5A]">
                            {step.number}
                          </span>

                          <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600 transition-colors duration-300 group-hover:text-zinc-400">
                            {step.label}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                          {step.description}
                        </p>

                        {/* Bottom detail */}
                        <div className="mt-8 flex items-center gap-3 text-xs text-zinc-600">
                          <span className="h-px w-8 bg-white/[0.12] transition-all duration-300 group-hover:w-14 group-hover:bg-[#D4AF5A]/60" />

                          <span>STEP {step.number} OF 03</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 border-t border-white/[0.08] pt-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-zinc-500">
              No complicated process. No unnecessary waiting. Just a better way
              to get behind the wheel.
            </p>

            <a
              href="/cars"
              className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors duration-200 hover:text-[#D4AF5A]"
            >
              Explore the fleet
              <ArrowUpRight size={16} strokeWidth={1.7} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
