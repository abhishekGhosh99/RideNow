"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Hero = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Subtle parallax movement
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0px", "-70px"]);
  const carScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const handleBookNow = () => {
    router.push(isAuthenticated ? "/booking" : "/login");
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-[#09090B] pt-[32px]"
    >
      {/* Background image */}
      <motion.div
        style={{
          y: backgroundY,
          scale: carScale,
        }}
        className="absolute inset-0 -top-[6%] h-[112%] w-full"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-img.png')",
          }}
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Hero content */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] items-center px-8 py-20 pt-24 sm:px-10 lg:px-14 xl:px-16"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[680px]"
        >
          {/* Eyebrow */}
          <motion.p
            variants={itemVariants}
            className="mb-7 text-sm font-medium uppercase tracking-[0.24em] text-[#D4AF5A]"
          >
            Premium car rental
          </motion.p>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="max-w-[700px] text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-[76px] xl:text-[82px]"
          >
            The right car
            <br />
            for every journey.
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mt-7 max-w-[590px] text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8"
          >
            From everyday city drives to weekend escapes, find and book your
            next car with RideNow.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <motion.button
              type="button"
              onClick={handleBookNow}
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-[#D4AF5A] px-7 text-sm font-semibold text-[#09090B] transition-colors duration-200 hover:bg-[#E0BE70]"
            >
              Browse cars
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>

            <Link href="/cars">
              <motion.span
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="inline-flex h-14 items-center justify-center rounded-xl border border-zinc-600 bg-black/20 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-zinc-400 hover:bg-white/10"
              >
                View available cars
              </motion.span>
            </Link>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex max-w-[660px] flex-wrap items-center gap-x-7 gap-y-5 border-t border-white/15 pt-7"
          >
            {/* Vehicles */}
            <div>
              <p className="text-2xl font-semibold tracking-tight text-white">
                500+
              </p>

              <p className="mt-1 text-sm text-zinc-400">Vehicles available</p>
            </div>

            <div className="h-10 w-px bg-white/15" />

            {/* Support */}
            <div>
              <p className="text-2xl font-semibold tracking-tight text-white">
                24/7
              </p>

              <p className="mt-1 text-sm text-zinc-400">Customer support</p>
            </div>

            <div className="h-10 w-px bg-white/15" />

            {/* Security */}
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#D4AF5A]" />

              <div>
                <p className="text-sm font-semibold text-white">
                  Secure booking
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  Simple & transparent
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
