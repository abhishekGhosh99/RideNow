"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, CarFront } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();

  const firstName = user?.firstName || user?.name?.split(" ")[0] || "there";

  return (
    <section className="mx-auto max-w-[1180px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF5A]">
          Overview
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          Welcome back, {firstName}.
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
          Manage your reservations, account details, and journeys from one
          place.
        </p>
      </motion.div>

      {/* Temporary overview cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="border border-white/[0.08] bg-[#111113] p-6"
        >
          <div className="flex h-10 w-10 items-center justify-center border border-[#D4AF5A]/20 bg-[#D4AF5A]/[0.06]">
            <CalendarDays
              className="h-5 w-5 text-[#D4AF5A]"
              strokeWidth={1.7}
            />
          </div>

          <p className="mt-6 text-sm font-medium text-zinc-300">My bookings</p>

          <p className="mt-2 text-sm leading-6 text-zinc-600">
            View and manage your current and previous reservations.
          </p>

          <Link
            href="/dashboard/bookings"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            View bookings
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.8}
            />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="border border-white/[0.08] bg-[#111113] p-6"
        >
          <div className="flex h-10 w-10 items-center justify-center border border-[#D4AF5A]/20 bg-[#D4AF5A]/[0.06]">
            <CarFront className="h-5 w-5 text-[#D4AF5A]" strokeWidth={1.7} />
          </div>

          <p className="mt-6 text-sm font-medium text-zinc-300">
            Find your next car
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Explore the RideNow fleet and choose your next drive.
          </p>

          <Link
            href="/cars"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Browse fleet
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.8}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPage;
