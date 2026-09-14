"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import CarCard from "@/components/cars/CarCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const FeaturedFleet = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Header moves slightly slower than the page
  const headerY = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -40]);

  // Background typography moves in the opposite direction
  const backgroundX = useTransform(scrollYProgress, [0, 1], [-120, 120]);

  // Fleet cards have a subtle vertical parallax
  const cardsY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -35]);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/cars?limit=3&sort=rating`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load our car collection.");
        }

        // Homepage should always display a maximum of 3 cars.
        setCars((data.data || []).slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch featured cars:", err);

        setError(err.message || "Unable to load cars right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="fleet"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.06] bg-[#09090B] px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      {/* ====================================================== */}
      {/* Background atmosphere */}
      {/* ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Large moving background text */}
        <motion.div
          style={{ x: backgroundX }}
          className="absolute left-1/2 top-16 -translate-x-1/2 whitespace-nowrap"
        >
          <p className="text-[90px] font-semibold uppercase tracking-[0.2em] text-white/[0.025] sm:text-[150px] lg:text-[210px]">
            RIDE NOW
          </p>
        </motion.div>

        {/* Subtle gold atmosphere */}
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 top-40 h-[420px] w-[420px] rounded-full bg-[#D4AF5A]/[0.035] blur-[120px]"
        />

        {/* Secondary atmosphere */}
        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 60, 0],
            scale: [1, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-32 bottom-20 h-[380px] w-[380px] rounded-full bg-white/[0.02] blur-[110px]"
        />

        {/* Fine vertical line */}
        <div className="absolute left-[8%] top-0 h-full w-px bg-white/[0.025]" />

        <div className="absolute right-[8%] top-0 h-full w-px bg-white/[0.025]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* ====================================================== */}
        {/* Header */}
        {/* ====================================================== */}

        <motion.div
          style={{ y: headerY }}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-16"
        >
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.2,
              }}
              className="h-px bg-[#D4AF5A]"
            />

            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF5A]">
              Our Fleet
            </span>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-4xl lg:text-6xl">
                Meet the RideNow fleet.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">
                A curated selection of vehicles built for city drives, weekend
                escapes, and everything in between.
              </p>
            </div>

            {/* Desktop link */}
            <Link
              href="/cars"
              className="group hidden shrink-0 items-center gap-3 border-b border-white/[0.12] pb-2 text-sm font-medium text-zinc-400 transition-colors duration-300 hover:border-[#D4AF5A]/60 hover:text-white lg:inline-flex"
            >
              View full fleet
              <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#D4AF5A]" />
            </Link>
          </div>
        </motion.div>

        {/* ====================================================== */}
        {/* Loading */}
        {/* ====================================================== */}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[360px] items-center justify-center border border-white/[0.08] bg-[#111113]"
          >
            <div className="flex flex-col items-center gap-4 text-sm text-zinc-500">
              <Loader2 className="h-6 w-6 animate-spin text-[#D4AF5A]" />

              <span>Loading our fleet...</span>
            </div>
          </motion.div>
        )}

        {/* ====================================================== */}
        {/* Error */}
        {/* ====================================================== */}

        {!loading && error && (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex min-h-[260px] flex-col items-center justify-center border border-white/[0.08] bg-[#111113] px-6 text-center"
          >
            <p className="text-sm text-zinc-400">{error}</p>

            <Link
              href="/cars"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#D4AF5A] transition-colors duration-200 hover:text-[#E0BE70]"
            >
              Browse all cars
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}

        {/* ====================================================== */}
        {/* Cars */}
        {/* ====================================================== */}

        {!loading && !error && cars.length > 0 && (
          <motion.div
            style={{ y: cardsY }}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.12,
            }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.14,
                },
              },
            }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {cars.map((car, index) => (
              <motion.div
                key={car._id}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 60,
                    scale: 0.97,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  },
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -10,
                }}
              >
                {/* Card number */}
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600">
                    0{index + 1}
                  </span>

                  <motion.span
                    initial={{ width: 32 }}
                    whileHover={{ width: 48 }}
                    className="h-px bg-white/[0.08]"
                  />
                </div>

                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ====================================================== */}
        {/* No cars */}
        {/* ====================================================== */}

        {!loading && !error && cars.length === 0 && (
          <div className="flex min-h-[240px] items-center justify-center border border-white/[0.08] bg-[#111113]">
            <p className="text-sm text-zinc-500">
              No cars are currently available.
            </p>
          </div>
        )}

        {/* ====================================================== */}
        {/* Bottom CTA */}
        {/* ====================================================== */}

        {!loading && !error && cars.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.6,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-16 flex flex-col items-center gap-5"
          >
            {/* Decorative line */}
            <div className="flex w-full items-center justify-center gap-4">
              <span className="h-px w-16 bg-white/[0.08]" />

              <span className="h-1 w-1 rounded-full bg-[#D4AF5A]" />

              <span className="h-px w-16 bg-white/[0.08]" />
            </div>

            <Link
              href="/cars"
              className="group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden border border-white/[0.1] bg-[#111113] px-7 text-sm font-medium text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF5A]/50 hover:bg-[#18181B] hover:text-white"
            >
              <span className="relative z-10">Explore all cars</span>

              <ArrowRight className="relative z-10 h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#D4AF5A]" />

              {/* Animated bottom accent */}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#D4AF5A] transition-all duration-500 group-hover:w-full" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedFleet;
