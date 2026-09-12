"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CarFront,
  ChevronRight,
  Loader2,
  MapPin,
  ReceiptText,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const formatDate = (date) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "₹0";
  }

  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

const getCarImage = (car) => {
  if (Array.isArray(car?.images) && car.images.length > 0) {
    const firstImage = car.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    return firstImage?.url || firstImage?.src || "";
  }

  return car?.image || "";
};

const getCarName = (car) => {
  return (
    car?.name ||
    `${car?.brand || ""} ${car?.model || ""}`.trim() ||
    "Rental vehicle"
  );
};

const getStatusStyles = (status) => {
  switch (status) {
    case "confirmed":
      return {
        label: "Confirmed",
        className: "border-[#D4AF5A]/25 bg-[#D4AF5A]/[0.07] text-[#D4AF5A]",
      };

    case "ongoing":
      return {
        label: "Ongoing",
        className: "border-blue-400/20 bg-blue-400/[0.06] text-blue-300",
      };

    case "completed":
      return {
        label: "Completed",
        className:
          "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        className: "border-red-400/20 bg-red-400/[0.06] text-red-300",
      };

    case "pending":
    default:
      return {
        label: "Pending",
        className: "border-zinc-600/40 bg-zinc-700/[0.08] text-zinc-400",
      };
  }
};

const getPaymentStyles = (status) => {
  switch (status) {
    case "paid":
      return {
        label: "Paid",
        className: "text-emerald-300",
      };

    case "refunded":
      return {
        label: "Refunded",
        className: "text-blue-300",
      };

    case "failed":
      return {
        label: "Payment failed",
        className: "text-red-300",
      };

    case "pending":
    default:
      return {
        label: "Payment pending",
        className: "text-zinc-500",
      };
  }
};

const BookingCard = ({ booking, index }) => {
  const car = booking?.car;

  const image = getCarImage(car);
  const carName = getCarName(car);

  const status = getStatusStyles(booking?.status);
  const payment = getPaymentStyles(booking?.paymentStatus);

  const pickupCity =
    booking?.pickupLocation?.city ||
    booking?.pickupLocation?.address ||
    "Pickup location not specified";

  const returnCity =
    booking?.returnLocation?.city ||
    booking?.returnLocation?.address ||
    pickupCity;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group border border-white/[0.08] bg-[#111113] transition-colors duration-300 hover:border-white/[0.14]"
    >
      <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Vehicle image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#18181B] lg:aspect-auto lg:min-h-[230px]">
          {image ? (
            <img
              src={image}
              alt={carName}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
            />
          ) : (
            <div className="flex h-full min-h-[210px] items-center justify-center">
              <CarFront className="h-12 w-12 text-zinc-700" />
            </div>
          )}

          {/* Image frame */}
          <div className="pointer-events-none absolute inset-4 border border-white/[0.08]" />
        </div>

        {/* Booking information */}
        <div className="flex min-w-0 flex-col p-5 sm:p-6 lg:p-7">
          {/* Top row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                Reservation
              </p>

              <h2 className="mt-2 truncate text-xl font-semibold tracking-[-0.025em] text-white">
                {carName}
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                {car?.brand || "RideNow"}
                {car?.model ? ` · ${car.model}` : ""}
              </p>
            </div>

            <span
              className={`inline-flex w-fit shrink-0 border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          {/* Details */}
          <div className="mt-7 grid gap-5 border-t border-white/[0.07] pt-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Dates */}
            <div className="flex items-start gap-3">
              <CalendarDays
                className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF5A]"
                strokeWidth={1.7}
              />

              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                  Rental period
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-200">
                  {formatDate(booking?.startDate)}
                </p>

                <p className="mt-0.5 text-xs text-zinc-600">
                  to {formatDate(booking?.endDate)}
                </p>
              </div>
            </div>

            {/* Pickup */}
            <div className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF5A]"
                strokeWidth={1.7}
              />

              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                  Pickup
                </p>

                <p className="mt-1 truncate text-sm font-medium text-zinc-200">
                  {pickupCity}
                </p>

                {returnCity !== pickupCity && (
                  <p className="mt-0.5 text-xs text-zinc-600">
                    Return: {returnCity}
                  </p>
                )}
              </div>
            </div>

            {/* Booking number */}
            <div className="flex items-start gap-3">
              <ReceiptText
                className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF5A]"
                strokeWidth={1.7}
              />

              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                  Booking number
                </p>

                <p className="mt-1 truncate text-sm font-medium text-zinc-200">
                  {booking?.bookingNumber || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-7 flex flex-col gap-4 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                Total
              </p>

              <div className="mt-1 flex items-baseline gap-3">
                <p className="text-xl font-semibold tracking-[-0.025em] text-white">
                  {formatCurrency(booking?.pricing?.totalAmount)}
                </p>

                <span className={`text-xs font-medium ${payment.className}`}>
                  {payment.label}
                </span>
              </div>
            </div>

            {/* Details button */}
            <Link
              href={`/dashboard/bookings/${booking._id}`}
              className="group/button inline-flex h-11 items-center justify-center gap-2 border border-white/[0.1] px-5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-[#D4AF5A]/40 hover:text-white"
            >
              View details
              <ChevronRight
                className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-0.5 group-hover/button:text-[#D4AF5A]"
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const BookingsPage = () => {
  const { user, loading: authLoading, authFetch } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await authFetch("/bookings/my");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load your bookings.");
        }

        setBookings(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);

        setError(err.message || "Unable to load your bookings right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authLoading, user, authFetch]);

  if (authLoading || loading) {
    return (
      <section className="mx-auto min-h-[60vh] max-w-[1180px]">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin text-[#D4AF5A]" />
            Loading your bookings...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1180px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF5A]">
          Reservations
        </p>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              My bookings
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              View your current reservations and rental history.
            </p>
          </div>

          <Link
            href="/cars"
            className="inline-flex h-11 w-fit items-center gap-2 bg-[#D4AF5A] px-5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#E0BE70]"
          >
            Book a car
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 border border-red-400/20 bg-red-400/[0.04] px-5 py-4"
        >
          <p className="text-sm font-medium text-red-300">
            Unable to load bookings
          </p>

          <p className="mt-1 text-xs leading-5 text-red-300/60">{error}</p>
        </motion.div>
      )}

      {/* Empty state */}
      {!error && bookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-10 border border-white/[0.08] bg-[#111113] px-6 py-16 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-white/[0.08] bg-[#18181B]">
            <CalendarDays className="h-6 w-6 text-zinc-600" strokeWidth={1.6} />
          </div>

          <p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-[#D4AF5A]">
            No reservations
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Your next journey starts here.
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
            You don't have any bookings yet. Explore the RideNow fleet and find
            a vehicle for your next trip.
          </p>

          <Link
            href="/cars"
            className="mt-7 inline-flex h-11 items-center gap-2 bg-[#D4AF5A] px-5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#E0BE70]"
          >
            Explore cars
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}

      {/* Booking list */}
      {!error && bookings.length > 0 && (
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-600">
              {bookings.length}{" "}
              {bookings.length === 1 ? "reservation" : "reservations"}
            </p>
          </div>

          {bookings.map((booking, index) => (
            <BookingCard key={booking._id} booking={booking} index={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BookingsPage;
