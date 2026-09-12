"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  CircleUserRound,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const { user, loading: authLoading, authFetch, updateUser } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError("");

        const response = await authFetch("/users/profile");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load your profile.");
        }

        const profile = data.data;

        setForm({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
        });

        updateUser(profile);
      } catch (err) {
        setError(err.message || "Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadProfile();
    }
  }, [user, authLoading, authFetch, updateUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccess("");

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!form.lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setSaving(true);

      const response = await authFetch("/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update your profile.");
      }

      const updatedUser = data.data;

      setForm({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
      });

      updateUser(updatedUser);

      setSuccess("Your profile has been updated.");
    } catch (err) {
      setError(err.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-[#09090B] px-6 py-12 text-zinc-100 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="h-3 w-20 animate-pulse bg-[#18181B]" />
          <div className="mt-4 h-10 w-48 animate-pulse bg-[#18181B]" />

          <div className="mt-10 border border-white/[0.07] bg-[#111113]">
            <div className="space-y-5 p-6 md:p-8">
              <div className="h-5 w-32 animate-pulse bg-[#18181B]" />
              <div className="grid gap-5 md:grid-cols-2">
                <div className="h-12 animate-pulse bg-[#18181B]" />
                <div className="h-12 animate-pulse bg-[#18181B]" />
              </div>
              <div className="h-12 animate-pulse bg-[#18181B]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "RideNow user";

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
    "U";

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#09090B] px-6 py-12 text-zinc-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF5A]">
            Profile
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Personal information
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
            Manage the information associated with your RideNow account.
          </p>
        </motion.div>

        {/* Profile identity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-10 border border-white/[0.07] bg-[#111113]"
        >
          <div className="flex flex-col gap-5 border-b border-white/[0.07] p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#18181B] text-lg font-semibold text-[#D4AF5A]">
              {initials}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                {fullName}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">{user.email}</p>
            </div>

            <div className="sm:ml-auto">
              <div className="inline-flex items-center gap-2 border border-[#D4AF5A]/20 bg-[#D4AF5A]/5 px-3 py-2 text-xs font-medium text-[#D4AF5A]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Account active
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                Account details
              </p>

              <h3 className="mt-2 text-lg font-medium text-zinc-100">
                Update your information
              </h3>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* First name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-zinc-500"
                >
                  First name
                </label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    className="h-12 w-full border border-white/[0.08] bg-[#09090B] pl-11 pr-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-700 focus:border-[#D4AF5A]/60"
                    placeholder="First name"
                  />
                </div>
              </div>

              {/* Last name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-zinc-500"
                >
                  Last name
                </label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    className="h-12 w-full border border-white/[0.08] bg-[#09090B] pl-11 pr-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-700 focus:border-[#D4AF5A]/60"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-zinc-500"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="h-12 w-full border border-white/[0.08] bg-[#09090B] pl-11 pr-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-700 focus:border-[#D4AF5A]/60"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="mt-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 flex items-center gap-2 border border-[#D4AF5A]/20 bg-[#D4AF5A]/5 px-4 py-3 text-sm text-[#D4AF5A]">
                <Check className="h-4 w-4" />
                {success}
              </div>
            )}

            {/* Save */}
            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 bg-[#D4AF5A] px-6 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#E0BE70] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </motion.section>

        {/* Account overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-6 border border-white/[0.07] bg-[#111113]"
        >
          <div className="border-b border-white/[0.07] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-[#18181B]">
                <CircleUserRound className="h-4 w-4 text-[#D4AF5A]" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-zinc-100">
                  Account overview
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Information about your RideNow account.
                </p>
              </div>
            </div>
          </div>

          <div className="grid divide-y divide-white/[0.07] md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-600">
                Account status
              </p>

              <p className="mt-2 text-sm font-medium text-zinc-200">Active</p>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-600">
                Current plan
              </p>

              <p className="mt-2 text-sm font-medium text-zinc-200">
                {user.activePlan?.displayName ||
                  user.activePlan?.name ||
                  "No active plan"}
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default ProfilePage;
