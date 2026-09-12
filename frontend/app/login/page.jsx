"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      router.replace(redirectTo);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090B] pt-[76px] text-[#F4F4F5]">
      <div className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-6xl items-center px-6 py-16 sm:px-8">
        <div className="grid w-full overflow-hidden border border-[#27272A] bg-[#111113] lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left content */}
          <div className="hidden border-r border-[#27272A] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div>
              <Link
                href="/"
                className="text-2xl font-semibold tracking-[-0.04em]"
              >
                Ride
                <span className="text-[#D4AF5A]">Now</span>
              </Link>

              <div className="mt-24 max-w-sm">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF5A]">
                  Welcome back
                </p>

                <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em]">
                  Your next drive starts here.
                </h1>

                <p className="mt-5 text-sm leading-7 text-[#A1A1AA]">
                  Sign in to manage your reservations, explore your trips, and
                  book your next RideNow vehicle.
                </p>
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.16em] text-[#52525B]">
              RIDENOW / 2026
            </p>
          </div>

          {/* Form */}
          <div className="p-7 sm:p-10 lg:p-14">
            <div className="mx-auto max-w-md">
              <div className="lg:hidden">
                <Link
                  href="/"
                  className="text-2xl font-semibold tracking-[-0.04em]"
                >
                  Ride
                  <span className="text-[#D4AF5A]">Now</span>
                </Link>
              </div>

              <div className="mt-10 lg:mt-0">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#D4AF5A]">
                  Account
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  Welcome back
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#71717A]">
                  Sign in to continue your reservation.
                </p>
              </div>

              {error && (
                <div className="mt-7 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#A1A1AA]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="h-12 w-full border border-[#27272A] bg-[#09090B] pl-11 pr-4 text-sm text-[#F4F4F5] outline-none transition-colors placeholder:text-[#52525B] focus:border-[#D4AF5A]/60"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#A1A1AA]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="h-12 w-full border border-[#27272A] bg-[#09090B] pl-11 pr-12 text-sm text-[#F4F4F5] outline-none transition-colors placeholder:text-[#52525B] focus:border-[#D4AF5A]/60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#71717A] transition-colors hover:text-[#F4F4F5]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 bg-[#D4AF5A] text-sm font-semibold text-[#09090B] transition-all duration-200 hover:bg-[#E0BE70] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-[#27272A] pt-7 text-center">
                <p className="text-sm text-[#71717A]">
                  Don't have an account?{" "}
                  <Link
                    href={`/signup${
                      redirectTo !== "/"
                        ? `?redirect=${encodeURIComponent(redirectTo)}`
                        : ""
                    }`}
                    className="font-medium text-[#D4AF5A] transition-colors hover:text-[#E0BE70]"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
