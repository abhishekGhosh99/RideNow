"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DashboardLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#27272A] border-t-[#D4AF5A]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <p className="text-sm text-zinc-500">
              Please sign in to access your dashboard.
            </p>

            <Link
              href="/login?redirect=/dashboard"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#D4AF5A] px-5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#E0BE70]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      {/* Space for the fixed global navbar */}
      <main className="min-h-screen pt-[76px]">
        {/* Dashboard header */}
        <header className="border-b border-white/[0.08]">
          <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs text-zinc-600">Your account</p>

              <p className="mt-1 text-sm font-medium text-zinc-300">
                RideNow dashboard
              </p>
            </div>

            <Link
              href="/cars"
              className="group hidden items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:flex"
            >
              Browse cars
              <ChevronRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </header>

        {/* Dashboard page */}
        <div className="mx-auto w-full max-w-[1440px] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
