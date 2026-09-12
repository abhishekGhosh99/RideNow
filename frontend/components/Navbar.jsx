"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Cars",
    href: "/cars",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const accountItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My bookings",
    href: "/dashboard/bookings",
    icon: CalendarDays,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
  {
    label: "Reviews",
    href: "/dashboard/reviews",
    icon: MessageSquare,
  },
];

const Navbar = () => {
  const pathname = usePathname();

  const { user, loading, logout } = useAuth();

  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const accountRef = useRef(null);

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/cars") {
      return pathname === "/cars" || pathname.startsWith("/cars/");
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isAccountActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    "Account";

  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Close account menu when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close account menu with Escape.
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogoutClick = () => {
    setAccountOpen(false);
    setLogoutOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutOpen(false);
    logout();
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[100] w-full border-b border-white/[0.08] bg-[#09090B]/95 backdrop-blur-md">
        <nav className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="text-[25px] font-semibold tracking-[-0.04em] text-white"
          >
            Ride<span className="text-[#D4AF5A]">Now</span>
          </Link>

          {/* Main navigation */}
          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative px-1 py-2"
                >
                  <span
                    className={`text-[15px] font-medium transition-colors duration-200 ${
                      active
                        ? "text-white"
                        : "text-zinc-400 hover:text-zinc-100"
                    }`}
                  >
                    {item.label}
                  </span>

                  {active && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#D4AF5A]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Account */}
          <div className="relative" ref={accountRef}>
            {loading ? (
              <div className="h-11 w-11 rounded-full border border-white/[0.08] bg-white/[0.03]" />
            ) : user ? (
              <>
                {/* User avatar */}
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-label="Open account menu"
                  aria-expanded={accountOpen}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-200 ${
                    accountOpen
                      ? "border-[#D4AF5A] bg-[#D4AF5A]/15 text-[#D4AF5A]"
                      : "border-[#D4AF5A]/30 bg-[#D4AF5A]/10 text-[#D4AF5A] hover:border-[#D4AF5A]/60 hover:bg-[#D4AF5A]/15"
                  }`}
                >
                  {initials}
                </button>

                {/* Account menu */}
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-[calc(100%+12px)] w-[280px] overflow-hidden border border-white/[0.1] bg-[#111113] shadow-2xl shadow-black/30"
                    >
                      {/* Heading */}
                      <div className="border-b border-white/[0.08] px-5 py-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                          Account
                        </p>
                      </div>

                      {/* Account navigation */}
                      <div className="p-2">
                        {accountItems.map((item) => {
                          const Icon = item.icon;
                          const active = isAccountActive(item.href);

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setAccountOpen(false)}
                              className={`group flex h-11 items-center gap-3 px-3 text-sm transition-colors ${
                                active
                                  ? "bg-white/[0.06] text-white"
                                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"
                              }`}
                            >
                              <Icon
                                className={`h-[17px] w-[17px] ${
                                  active
                                    ? "text-[#D4AF5A]"
                                    : "text-zinc-600 group-hover:text-zinc-400"
                                }`}
                                strokeWidth={1.8}
                              />

                              <span className="flex-1">{item.label}</span>

                              {active && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF5A]" />
                              )}
                            </Link>
                          );
                        })}
                      </div>

                      {/* User information */}
                      <div className="border-t border-white/[0.08] px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D4AF5A]/30 bg-[#D4AF5A]/10 text-[11px] font-semibold text-[#D4AF5A]">
                            {initials}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-zinc-200">
                              {fullName}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-zinc-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Sign out */}
                      <div className="border-t border-white/[0.08] p-2">
                        <button
                          type="button"
                          onClick={handleLogoutClick}
                          className="flex h-11 w-full items-center gap-3 px-3 text-sm text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
                        >
                          <LogOut
                            className="h-[17px] w-[17px]"
                            strokeWidth={1.8}
                          />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#D4AF5A] px-5 text-sm font-semibold text-[#09090B] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E0BE70]"
              >
                Login / Signup
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Sign-out confirmation */}
      <AnimatePresence>
        {logoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setLogoutOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[420px] border border-white/[0.1] bg-[#111113] p-6 shadow-2xl shadow-black/40"
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-zinc-600 transition-colors hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex h-11 w-11 items-center justify-center border border-[#D4AF5A]/20 bg-[#D4AF5A]/[0.06]">
                <LogOut className="h-5 w-5 text-[#D4AF5A]" strokeWidth={1.7} />
              </div>

              <h2 className="mt-6 text-xl font-semibold tracking-[-0.025em] text-white">
                Sign out?
              </h2>

              <p className="mt-2 max-w-[340px] text-sm leading-6 text-zinc-500">
                Are you sure you want to sign out of your RideNow account?
              </p>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLogoutOpen(false)}
                  className="h-11 px-5 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="h-11 bg-[#D4AF5A] px-5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#E0BE70]"
                >
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
