"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CarFront, CircleDollarSign, ShieldCheck } from "lucide-react";

const benefits = [
  {
    number: "01",
    icon: CarFront,
    title: "A fleet worth choosing",
    description:
      "From practical city cars to premium SUVs, choose from a focused selection of vehicles built around different kinds of journeys.",
  },
  {
    number: "02",
    icon: CircleDollarSign,
    title: "Pricing you can understand",
    description:
      "See the rental rate before you book. No confusing pricing structure or unnecessary steps between you and your total.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "A booking experience you can trust",
    description:
      "Everything is designed to keep the process simple, transparent, and focused from selecting your car to getting on the road.",
  },
];

const WhyRideNow = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Main heading moves slightly against the scroll direction
  const headingY = useTransform(scrollYProgress, [0, 0.5, 1], [70, 0, -70]);

  // Image moves more aggressively than the content
  const imageY = useTransform(scrollYProgress, [0, 0.5, 1], [-140, 0, 140]);

  // Image slowly scales while entering/leaving the viewport
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.08, 1, 1.08],
  );

  // Caption has its own parallax layer
  const captionY = useTransform(scrollYProgress, [0, 0.5, 1], [45, 0, -45]);

  // Benefits move in the opposite direction
  const benefitsY = useTransform(scrollYProgress, [0, 0.5, 1], [45, 0, -45]);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden border-t border-white/[0.06] bg-[#09090B]"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
        {/* Section intro */}
        <motion.div style={{ y: headingY }} className="max-w-4xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#D4AF5A]">
            Why RideNow
          </p>

          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
            Built around a better
            <br />
            way to rent.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
            A straightforward rental experience with the cars, pricing, and
            tools you need — without getting in the way of the journey.
          </p>
        </motion.div>

        {/* Main parallax area */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          {/* Image */}
          <div className="relative">
            {/* Extra space allows the image to travel vertically */}
            <div className="relative h-[460px] overflow-hidden border border-white/[0.08] bg-[#111113] sm:h-[560px] lg:h-[620px]">
              <motion.div
                style={{
                  y: imageY,
                  scale: imageScale,
                }}
                className="absolute inset-[-40px]"
              >
                <img
                  src="/images/whyridenow.png"
                  alt="Premium car ready for a journey"
                  className="h-full w-full object-cover"
                />
              </motion.div>

              {/* Image overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Subtle bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/50 to-transparent" />

              {/* Floating caption */}
              <motion.div
                style={{ y: captionY }}
                className="absolute bottom-7 left-7 border border-white/[0.12] bg-[#09090B]/85 px-5 py-4 backdrop-blur-md"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  RideNow
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  Your journey starts here.
                </p>
              </motion.div>
            </div>

            {/* Small decorative line */}
            <motion.div
              style={{
                scaleX: useTransform(
                  scrollYProgress,
                  [0.15, 0.5, 0.85],
                  [0, 1, 0],
                ),
              }}
              className="absolute -bottom-4 left-0 h-px w-32 origin-left bg-[#D4AF5A]"
            />
          </div>

          {/* Benefits */}
          <motion.div
            style={{ y: benefitsY }}
            className="divide-y divide-white/[0.08] border-y border-white/[0.08]"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.number}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    x: 8,
                  }}
                  className="group grid gap-5 py-8 sm:grid-cols-[52px_1fr] sm:gap-7"
                >
                  <div className="flex h-10 w-10 items-center justify-center border border-white/[0.1] bg-[#111113] text-[#D4AF5A] transition-all duration-300 group-hover:border-[#D4AF5A]/40 group-hover:bg-[#18181B]">
                    <Icon size={18} strokeWidth={1.7} />
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium tracking-[0.12em] text-zinc-600">
                        {benefit.number}
                      </span>

                      <h3 className="text-xl font-semibold text-white">
                        {benefit.title}
                      </h3>
                    </div>

                    <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-400">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyRideNow;
