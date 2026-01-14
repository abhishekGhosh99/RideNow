"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CalendarDays, Car, Clock, User } from "lucide-react";

export default function BookingPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null;

  const [form, setForm] = useState({
    name: "",
    email: "",
    carType: "",
    pickUpDate: "",
    dropOffDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar showLinks={false} showBookButton={false} showBackButton={true} />
      <section className="min-h-screen py-20 px-6 lg:px-20 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900"></div>

          <div className="absolute top-10 right-20 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>

          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80caff_1px,transparent_1px),linear-gradient(to_bottom,#80caff_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text">
            Book Your Ride
          </h1>
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto">
            Fill in the details below and reserve your dream car in minutes.
          </p>
        </div>

        {/* Booking Form */}
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col space-y-2">
              <label className="text-slate-200 font-medium flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyan-400 outline-none"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-2">
              <label className="text-slate-200 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyan-400 outline-none"
                placeholder="your@email.com"
              />
            </div>

            {/* Car Type */}
            <div className="flex flex-col space-y-2">
              <label className="text-slate-200 font-medium flex items-center gap-2">
                <Car className="w-4 h-4" /> Car Type
              </label>
              <select
                name="carType"
                value={form.carType}
                onChange={handleChange}
                className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyan-400 outline-none"
              >
                <option value="" className="text-black bg-transparent">
                  Select a Car
                </option>
                <option value="SUV" className="text-black">
                  SUV
                </option>
                <option value="Sedan" className="text-black">
                  Sedan
                </option>
                <option value="Luxury" className="text-black">
                  Luxury
                </option>
                <option value="Electric" className="text-black">
                  Electric
                </option>
              </select>
            </div>

            {/* Pick-Up Date */}
            <div className="relative flex flex-col space-y-2">
              <label className="text-slate-200 font-medium flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Pick-Up Date
              </label>
              <input
                type="date"
                name="pickUpDate"
                value={form.pickUpDate}
                onChange={handleChange}
                className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyan-400 outline-none w-full
               [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white absolute right-4 top-[64%] -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Drop-Off Date */}
            <div className="relative flex flex-col space-y-2">
              <label className="text-slate-200 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" /> Drop-Off Date
              </label>
              <input
                type="date"
                name="dropOffDate"
                value={form.dropOffDate}
                onChange={handleChange}
                className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyan-400 outline-none w-full
               [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white absolute right-4 top-[64%] -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </form>

          {/* Submit Button */}
          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-10 py-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/40 transition-all"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
