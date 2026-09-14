"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  Fuel,
  Gauge,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "/api");

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const getImage = (car) => {
  if (Array.isArray(car?.images) && car.images.length > 0) {
    const firstImage = car.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    return firstImage?.url || firstImage?.src || "";
  }

  return car?.image || "";
};

const getPrice = (car) => {
  return (
    car?.pricing?.perDay ??
    car?.pricing?.dailyRate ??
    car?.pricing?.pricePerDay ??
    car?.pricePerDay ??
    car?.price ??
    0
  );
};

const formatDate = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

const getRentalDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  const difference = end.getTime() - start.getTime();

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* -------------------------------------------------------------------------- */
/* Input                                                                       */
/* -------------------------------------------------------------------------- */

const Field = ({ label, icon: Icon, error, children, className = "" }) => {
  return (
    <div className={className}>
      <label className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {Icon && <Icon className="h-3.5 w-3.5 text-[#D4AF5A]" />}
        {label}
      </label>

      {children}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
};

const inputClass =
  "h-12 w-full border border-white/[0.09] bg-[#111113] px-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-[#D4AF5A]";

const selectClass =
  "h-12 w-full appearance-none border border-white/[0.09] bg-[#111113] px-4 pr-10 text-sm text-white outline-none transition-colors focus:border-[#D4AF5A]";

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { isAuthenticated, loading: authLoading, authFetch } = useAuth();

  const [car, setCar] = useState(null);
  const [carLoading, setCarLoading] = useState(true);
  const [carError, setCarError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    pickupLocation: searchParams.get("location") || "",
    returnLocation: searchParams.get("location") || "",
    fullName: "",
    email: "",
    phone: "",
    driverLicense: "",
    specialRequests: "",
  });

  /* ------------------------------------------------------------------------ */
  /* Authentication                                                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  /* ------------------------------------------------------------------------ */
  /* Fetch car                                                                 */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setCarLoading(true);
        setCarError("");

        const response = await fetch(`${API_URL}/cars/${params.carId}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load vehicle.");
        }

        setCar(data.data);
      } catch (error) {
        setCarError(error.message || "Unable to load vehicle.");
      } finally {
        setCarLoading(false);
      }
    };

    if (params.carId) {
      fetchCar();
    }
  }, [params.carId]);

  /* ------------------------------------------------------------------------ */
  /* Form handlers                                                             */
  /* ------------------------------------------------------------------------ */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSubmitError("");
  };

  /* ------------------------------------------------------------------------ */
  /* Calculations                                                              */
  /* ------------------------------------------------------------------------ */

  const rentalDays = useMemo(
    () => getRentalDays(form.startDate, form.endDate),
    [form.startDate, form.endDate],
  );

  const dailyPrice = car ? Number(getPrice(car)) : 0;

  const estimatedBasePrice = rentalDays > 0 ? dailyPrice * rentalDays : 0;

  const estimatedInsurance = estimatedBasePrice * 0.1;

  const estimatedSubtotal = estimatedBasePrice + estimatedInsurance;

  const estimatedTaxes = estimatedSubtotal * 0.08;

  const estimatedTotal = estimatedSubtotal + estimatedTaxes;

  /* ------------------------------------------------------------------------ */
  /* Validation                                                                */
  /* ------------------------------------------------------------------------ */

  const validateForm = () => {
    if (!form.startDate) {
      return "Please select a pickup date.";
    }

    if (!form.endDate) {
      return "Please select a return date.";
    }

    if (rentalDays <= 0) {
      return "Return date must be after the pickup date.";
    }

    if (!form.pickupLocation.trim()) {
      return "Please enter a pickup location.";
    }

    if (!form.returnLocation.trim()) {
      return "Please enter a return location.";
    }

    if (!form.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!form.email.trim()) {
      return "Please enter your email address.";
    }

    if (!form.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!form.driverLicense.trim()) {
      return "Please enter your driving licence number.";
    }

    return "";
  };

  /* ------------------------------------------------------------------------ */
  /* Create booking                                                            */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const response = await authFetch("/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          carId: params.carId,
          startDate: form.startDate,
          endDate: form.endDate,
          pickupLocation: form.pickupLocation,
          returnLocation: form.returnLocation,
          driverInfo: {
            name: form.fullName,
            email: form.email,
            phone: form.phone,
            licenseNumber: form.driverLicense,
          },
          specialRequests: form.specialRequests,
          appliedPlan: null,
          promoCode: null,
          extras: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create booking.");
      }

      const bookingId = data?.data?._id || data?.booking?._id || data?.data?.id;

      if (!bookingId) {
        throw new Error("Booking was created, but no booking ID was returned.");
      }

      router.push(`/checkout/${bookingId}`);
    } catch (error) {
      setSubmitError(error.message || "Unable to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                   */
  /* ------------------------------------------------------------------------ */

  if (authLoading || carLoading) {
    return (
      <main className="min-h-screen bg-[#09090B] pt-[76px] text-white">
        <div className="mx-auto max-w-[1440px] px-6 py-12 sm:px-8 lg:px-10">
          <div className="h-4 w-28 animate-pulse bg-[#18181B]" />

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-8">
              <div className="h-10 w-72 animate-pulse bg-[#18181B]" />

              <div className="h-40 animate-pulse bg-[#111113]" />

              <div className="h-72 animate-pulse bg-[#111113]" />

              <div className="h-52 animate-pulse bg-[#111113]" />
            </div>

            <div className="h-[500px] animate-pulse bg-[#111113]" />
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                     */
  /* ------------------------------------------------------------------------ */

  if (carError || !car) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090B] px-6 pt-[76px] text-white">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-white/[0.08] bg-[#111113]">
            <CarFront className="h-7 w-7 text-zinc-600" />
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF5A]">
            Booking unavailable
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            Vehicle not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {carError || "We couldn't load this vehicle."}
          </p>

          <Link
            href="/cars"
            className="mt-7 inline-flex h-12 items-center gap-2 bg-[#D4AF5A] px-6 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#E0BE70]"
          >
            Browse cars
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Vehicle information                                                       */
  /* ------------------------------------------------------------------------ */

  const image = getImage(car);

  const carName =
    car.name ||
    `${car.brand || ""} ${car.model || ""}`.trim() ||
    "Premium Vehicle";

  const transmission = car.specifications?.transmission || "Automatic";

  const fuel = car.specifications?.fuelType || "Petrol";

  const seats = car.specifications?.seats || 5;

  const location =
    car.location?.city ||
    car.location?.name ||
    form.pickupLocation ||
    "Available";

  /* ------------------------------------------------------------------------ */
  /* Render                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-[#09090B] pt-[76px] text-white">
      {/* -------------------------------------------------------------------- */}
      {/* Top bar                                                               */}
      {/* -------------------------------------------------------------------- */}

      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1440px] px-6 py-5 sm:px-8 lg:px-10">
          <Link
            href={`/cars/${params.carId}`}
            className="group inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to vehicle
          </Link>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Header                                                                */}
      {/* -------------------------------------------------------------------- */}

      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1440px] px-6 py-12 sm:px-8 lg:px-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF5A]">
              Reserve your vehicle
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Book your ride.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
              Enter your rental details and driver information to continue to
              checkout.
            </p>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* Booking content                                                       */}
      {/* -------------------------------------------------------------------- */}

      <form onSubmit={handleSubmit}>
        <div className="mx-auto max-w-[1440px] px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            {/* ================================================================= */}
            {/* FORM                                                               */}
            {/* ================================================================= */}

            <div className="space-y-10">
              {/* ---------------------------------------------------------------- */}
              {/* Rental details                                                    */}
              {/* ---------------------------------------------------------------- */}

              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <div className="mb-6 flex items-end justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4AF5A]">
                      01
                    </p>

                    <h2 className="mt-1 text-xl font-semibold tracking-[-0.025em]">
                      Rental details
                    </h2>
                  </div>

                  {rentalDays > 0 && (
                    <p className="text-xs text-zinc-500">
                      {rentalDays} {rentalDays === 1 ? "day" : "days"}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Pickup date" icon={CalendarDays}>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      min={getToday()}
                      onChange={handleChange}
                      className={`${inputClass} [&::-webkit-calendar-picker-indicator]:opacity-60`}
                    />
                  </Field>

                  <Field label="Return date" icon={CalendarDays}>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      min={form.startDate || getToday()}
                      onChange={handleChange}
                      className={`${inputClass} [&::-webkit-calendar-picker-indicator]:opacity-60`}
                    />
                  </Field>

                  <Field label="Pickup location" icon={MapPin}>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={form.pickupLocation}
                      onChange={handleChange}
                      placeholder="Where will you collect the car?"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Return location" icon={MapPin}>
                    <input
                      type="text"
                      name="returnLocation"
                      value={form.returnLocation}
                      onChange={handleChange}
                      placeholder="Where will you return the car?"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </motion.section>

              {/* ---------------------------------------------------------------- */}
              {/* Driver information                                               */}
              {/* ---------------------------------------------------------------- */}

              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="mb-6 border-b border-white/[0.08] pb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4AF5A]">
                    02
                  </p>

                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.025em]">
                    Driver information
                  </h2>

                  <p className="mt-2 text-sm text-zinc-600">
                    Enter the details of the person driving the vehicle.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" icon={User}>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Email address" icon={Mail}>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Phone number" icon={Phone}>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Driving licence" icon={CreditCard}>
                    <input
                      type="text"
                      name="driverLicense"
                      value={form.driverLicense}
                      onChange={handleChange}
                      placeholder="Licence number"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </motion.section>

              {/* ---------------------------------------------------------------- */}
              {/* Additional requests                                               */}
              {/* ---------------------------------------------------------------- */}

              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div className="mb-6 border-b border-white/[0.08] pb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4AF5A]">
                    03
                  </p>

                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.025em]">
                    Additional requests
                  </h2>
                </div>

                <Field label="Special requests">
                  <textarea
                    name="specialRequests"
                    value={form.specialRequests}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Anything we should know before your rental?"
                    className="w-full resize-none border border-white/[0.09] bg-[#111113] px-4 py-4 text-sm leading-6 text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-[#D4AF5A]"
                  />
                </Field>
              </motion.section>

              {/* ---------------------------------------------------------------- */}
              {/* Submit error                                                      */}
              {/* ---------------------------------------------------------------- */}

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-red-500/20 bg-red-500/[0.05] px-5 py-4"
                >
                  <p className="text-sm text-red-400">{submitError}</p>
                </motion.div>
              )}

              {/* ---------------------------------------------------------------- */}
              {/* Continue button                                                   */}
              {/* ---------------------------------------------------------------- */}

              <div className="border-t border-white/[0.08] pt-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex h-14 w-full items-center justify-between bg-[#D4AF5A] px-6 text-sm font-semibold text-[#09090B] transition-all duration-200 hover:bg-[#E0BE70] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {submitting
                      ? "Creating reservation..."
                      : "Continue to checkout"}
                  </span>

                  {!submitting && (
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-zinc-600">
                  Your final rental price will be confirmed at checkout.
                </p>
              </div>
            </div>

            {/* ================================================================= */}
            {/* SUMMARY                                                            */}
            {/* ================================================================= */}

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.15,
              }}
              className="lg:sticky lg:top-[104px]"
            >
              <div className="border border-white/[0.08] bg-[#111113]">
                {/* Vehicle image */}
                <div className="relative h-[220px] overflow-hidden bg-[#18181B]">
                  {image ? (
                    <img
                      src={image}
                      alt={carName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <CarFront className="h-12 w-12 text-zinc-800" />
                    </div>
                  )}

                  <div className="absolute left-4 top-4 border border-white/[0.1] bg-[#09090B]/85 px-3 py-2 backdrop-blur-sm">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#D4AF5A]">
                      RideNow
                    </span>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="border-b border-white/[0.08] p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Your vehicle
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                    {carName}
                  </h2>

                  <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
                    <MapPin className="h-4 w-4 text-[#D4AF5A]" />
                    {location}
                  </div>

                  <div className="mt-5 grid grid-cols-3 border-t border-white/[0.08] pt-5">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                        Transmission
                      </p>

                      <p className="mt-1 text-xs text-zinc-300">
                        {transmission}
                      </p>
                    </div>

                    <div className="border-l border-white/[0.08] pl-4">
                      <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                        Fuel
                      </p>

                      <p className="mt-1 text-xs text-zinc-300">{fuel}</p>
                    </div>

                    <div className="border-l border-white/[0.08] pl-4">
                      <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                        Seats
                      </p>

                      <p className="mt-1 text-xs text-zinc-300">{seats}</p>
                    </div>
                  </div>
                </div>

                {/* Rental period */}
                <div className="border-b border-white/[0.08] p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                      Rental period
                    </p>

                    {rentalDays > 0 && (
                      <span className="text-xs text-[#D4AF5A]">
                        {rentalDays} {rentalDays === 1 ? "day" : "days"}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                        Pickup
                      </p>

                      <p className="mt-2 text-sm font-medium text-zinc-200">
                        {form.startDate
                          ? formatDate(form.startDate)
                          : "Select date"}
                      </p>
                    </div>

                    <div className="border-l border-white/[0.08] pl-5">
                      <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                        Return
                      </p>

                      <p className="mt-2 text-sm font-medium text-zinc-200">
                        {form.endDate
                          ? formatDate(form.endDate)
                          : "Select date"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="p-6">
                  {/* Base rental */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">
                      ₹{dailyPrice.toLocaleString("en-IN")} × {rentalDays || 0}{" "}
                      {rentalDays === 1 ? "day" : "days"}
                    </span>

                    <span className="text-zinc-300">
                      ₹{estimatedBasePrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Insurance */}
                  {rentalDays > 0 && (
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Insurance</span>

                      <span className="text-zinc-300">
                        ₹{estimatedInsurance.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  {/* Subtotal */}
                  {rentalDays > 0 && (
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Subtotal</span>

                      <span className="text-zinc-300">
                        ₹{estimatedSubtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  {/* Taxes */}
                  {rentalDays > 0 && (
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Estimated taxes</span>

                      <span className="text-zinc-300">
                        ₹{estimatedTaxes.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="mt-5 border-t border-white/[0.08] pt-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                          Estimated total
                        </p>

                        <p className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-white">
                          ₹{estimatedTotal.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {rentalDays > 0 && (
                        <span className="text-xs text-zinc-600">
                          before checkout
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust note */}
              <div className="mt-4 flex items-start gap-3 border border-white/[0.06] px-5 py-4">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF5A]" />

                <p className="text-xs leading-5 text-zinc-600">
                  Your reservation will be reviewed before payment is processed.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </form>
    </main>
  );
}
