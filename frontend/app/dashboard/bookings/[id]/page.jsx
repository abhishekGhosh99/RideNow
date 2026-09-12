"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  UserRound,
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

const DetailRow = ({ label, value }) => {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <span className="text-sm text-zinc-500">{label}</span>

      <span className="text-right text-sm font-medium text-zinc-200">
        {value || "—"}
      </span>
    </div>
  );
};

const BookingDetailsPage = () => {
  const params = useParams();

  const { user, loading: authLoading, authFetch } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user || !params?.id) {
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await authFetch(`/bookings/${params.id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load this booking.");
        }

        setBooking(data.data);
      } catch (err) {
        console.error("Failed to fetch booking:", err);

        setError(err.message || "Unable to load this booking right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [authLoading, user, params?.id, authFetch]);

  if (authLoading || loading) {
    return (
      <section className="mx-auto min-h-[65vh] max-w-[1180px]">
        <div className="flex min-h-[55vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <Loader2
              className="h-4 w-4 animate-spin text-[#D4AF5A]"
              strokeWidth={1.8}
            />
            Loading reservation...
          </div>
        </div>
      </section>
    );
  }

  if (error || !booking) {
    return (
      <section className="mx-auto max-w-[1180px]">
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>

        <div className="mt-8 border border-white/[0.08] bg-[#111113] px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-white/[0.08] bg-[#18181B]">
            <FileText className="h-6 w-6 text-zinc-600" strokeWidth={1.6} />
          </div>

          <p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-red-300">
            Reservation unavailable
          </p>

          <h1 className="mt-2 text-xl font-semibold text-white">
            We couldn't find this booking.
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
            {error ||
              "The reservation may no longer exist or may not belong to your account."}
          </p>

          <Link
            href="/dashboard/bookings"
            className="mt-7 inline-flex h-11 items-center gap-2 bg-[#D4AF5A] px-5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#E0BE70]"
          >
            Back to bookings
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  const car = booking.car;

  const image = getCarImage(car);
  const carName = getCarName(car);

  const status = getStatusStyles(booking.status);
  const payment = getPaymentStyles(booking.paymentStatus);

  const pickupCity =
    booking.pickupLocation?.city ||
    booking.pickupLocation?.address ||
    "Not specified";

  const returnCity =
    booking.returnLocation?.city ||
    booking.returnLocation?.address ||
    pickupCity;

  const pricing = booking.pricing || {};

  const driverName = booking.driverInfo?.name || "—";
  const driverEmail = booking.driverInfo?.email || "—";
  const driverPhone = booking.driverInfo?.phone || "—";

  return (
    <section className="mx-auto max-w-[1180px]">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Link
          href="/dashboard/bookings"
          className="group inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            strokeWidth={1.8}
          />
          My bookings
        </Link>
      </motion.div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="mt-7 border-b border-white/[0.08] pb-7"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF5A]">
              Reservation
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
                {booking.bookingNumber || "Reservation"}
              </h1>

              <span
                className={`inline-flex border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${status.className}`}
              >
                {status.label}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
              Booked on
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              {formatDate(booking.createdAt)}
            </p>
          </div>
        </div>
      </motion.header>

      {/* Main */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Vehicle */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="border border-white/[0.08] bg-[#111113]"
          >
            <div className="relative aspect-[16/8] overflow-hidden bg-[#18181B] sm:aspect-[16/7]">
              {image ? (
                <img
                  src={image}
                  alt={carName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[220px] items-center justify-center">
                  <CarFront
                    className="h-14 w-14 text-zinc-700"
                    strokeWidth={1.4}
                  />
                </div>
              )}

              <div className="pointer-events-none absolute inset-4 border border-white/[0.08]" />
            </div>

            <div className="p-6 sm:p-7">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                Vehicle
              </p>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                    {carName}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-600">
                    {car?.brand || "RideNow"}
                    {car?.model ? ` · ${car.model}` : ""}
                    {car?.year ? ` · ${car.year}` : ""}
                  </p>
                </div>

                <Link
                  href={`/cars/${car?._id}`}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  View vehicle
                  <ChevronRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#D4AF5A]"
                    strokeWidth={1.8}
                  />
                </Link>
              </div>
            </div>
          </motion.section>

          {/* Rental period */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="border border-white/[0.08] bg-[#111113]"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-6 py-5 sm:px-7">
              <div className="flex h-10 w-10 items-center justify-center border border-[#D4AF5A]/20 bg-[#D4AF5A]/[0.05]">
                <CalendarDays
                  className="h-4 w-4 text-[#D4AF5A]"
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Rental period
                </h2>

                <p className="mt-0.5 text-xs text-zinc-600">
                  Your reservation dates and locations
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2">
              <div className="border-b border-white/[0.08] p-6 sm:border-b-0 sm:border-r sm:p-7">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  Pickup
                </p>

                <p className="mt-2 text-lg font-medium text-white">
                  {formatDate(booking.startDate)}
                </p>

                <div className="mt-4 flex items-start gap-2">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF5A]"
                    strokeWidth={1.7}
                  />

                  <div>
                    <p className="text-sm text-zinc-300">{pickupCity}</p>

                    {booking.pickupLocation?.address && (
                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                        {booking.pickupLocation.address}
                      </p>
                    )}

                    {booking.pickupLocation?.time && (
                      <p className="mt-1 text-xs text-zinc-500">
                        {booking.pickupLocation.time}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  Return
                </p>

                <p className="mt-2 text-lg font-medium text-white">
                  {formatDate(booking.endDate)}
                </p>

                <div className="mt-4 flex items-start gap-2">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF5A]"
                    strokeWidth={1.7}
                  />

                  <div>
                    <p className="text-sm text-zinc-300">{returnCity}</p>

                    {booking.returnLocation?.address && (
                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                        {booking.returnLocation.address}
                      </p>
                    )}

                    {booking.returnLocation?.time && (
                      <p className="mt-1 text-xs text-zinc-500">
                        {booking.returnLocation.time}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {booking.duration?.days && (
              <div className="border-t border-white/[0.08] px-6 py-4 sm:px-7">
                <p className="text-xs text-zinc-600">
                  Rental duration{" "}
                  <span className="font-medium text-zinc-300">
                    {booking.duration.days}{" "}
                    {booking.duration.days === 1 ? "day" : "days"}
                  </span>
                </p>
              </div>
            )}
          </motion.section>

          {/* Driver */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="border border-white/[0.08] bg-[#111113]"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-6 py-5 sm:px-7">
              <div className="flex h-10 w-10 items-center justify-center border border-[#D4AF5A]/20 bg-[#D4AF5A]/[0.05]">
                <UserRound
                  className="h-4 w-4 text-[#D4AF5A]"
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Driver details
                </h2>

                <p className="mt-0.5 text-xs text-zinc-600">
                  Information provided for this reservation
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2">
              <div className="px-6 py-5 sm:px-7">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  Name
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {driverName}
                </p>
              </div>

              <div className="border-t border-white/[0.08] px-6 py-5 sm:border-l sm:border-t-0 sm:px-7">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  Email
                </p>

                <p className="mt-2 truncate text-sm font-medium text-zinc-200">
                  {driverEmail}
                </p>
              </div>

              <div className="border-t border-white/[0.08] px-6 py-5 sm:border-l sm:px-7">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  Phone
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {driverPhone}
                </p>
              </div>

              <div className="border-t border-white/[0.08] px-6 py-5 sm:px-7">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  License number
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {booking.driverInfo?.licenseNumber || "—"}
                </p>
              </div>

              <div className="border-t border-white/[0.08] px-6 py-5 sm:border-l sm:px-7">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  Main driver
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {booking.driverInfo?.isMainDriver === false ? "No" : "Yes"}
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Right column */}
        <div className="space-y-6 lg:sticky lg:top-[100px] lg:self-start">
          {/* Payment summary */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="border border-white/[0.08] bg-[#111113]"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center border border-[#D4AF5A]/20 bg-[#D4AF5A]/[0.05]">
                <CreditCard
                  className="h-4 w-4 text-[#D4AF5A]"
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Payment summary
                </h2>

                <p className="mt-0.5 text-xs text-zinc-600">
                  Final reservation amount
                </p>
              </div>
            </div>

            <div className="px-6">
              <DetailRow
                label="Rental"
                value={formatCurrency(pricing.basePrice)}
              />

              {Number(pricing.planDiscount) > 0 && (
                <DetailRow
                  label="Plan discount"
                  value={`−${formatCurrency(pricing.planDiscount)}`}
                />
              )}

              {Number(pricing.promoDiscount) > 0 && (
                <DetailRow
                  label="Promo discount"
                  value={`−${formatCurrency(pricing.promoDiscount)}`}
                />
              )}

              {Number(pricing.insurance) > 0 && (
                <DetailRow
                  label="Insurance"
                  value={formatCurrency(pricing.insurance)}
                />
              )}

              {Number(pricing.extraCharges) > 0 && (
                <DetailRow
                  label="Extras"
                  value={formatCurrency(pricing.extraCharges)}
                />
              )}

              {Number(pricing.taxes) > 0 && (
                <DetailRow
                  label="Taxes"
                  value={formatCurrency(pricing.taxes)}
                />
              )}

              <div className="border-t border-white/[0.08] py-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm font-medium text-zinc-300">
                    Total
                  </span>

                  <span className="text-2xl font-semibold tracking-[-0.03em] text-white">
                    {formatCurrency(pricing.totalAmount)}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {booking.paymentStatus === "paid" ? (
                    <CheckCircle2
                      className="h-4 w-4 text-emerald-300"
                      strokeWidth={1.7}
                    />
                  ) : (
                    <CreditCard
                      className="h-4 w-4 text-zinc-600"
                      strokeWidth={1.7}
                    />
                  )}

                  <span className={`text-xs ${payment.className}`}>
                    {payment.label}
                  </span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Booking information */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="border border-white/[0.08] bg-[#111113] p-6"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
              Reservation details
            </p>

            <div className="mt-4 divide-y divide-white/[0.07]">
              <DetailRow label="Booking number" value={booking.bookingNumber} />

              <DetailRow label="Status" value={status.label} />

              {booking.appliedPlan && (
                <DetailRow
                  label="Plan"
                  value={
                    booking.appliedPlan.displayName || booking.appliedPlan.name
                  }
                />
              )}

              {booking.promoCode && (
                <DetailRow label="Promo code" value={booking.promoCode} />
              )}
            </div>
          </motion.section>

          {/* Special requests */}
          {booking.specialRequests && (
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="border border-white/[0.08] bg-[#111113] p-6"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                Special requests
              </p>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {booking.specialRequests}
              </p>
            </motion.section>
          )}

          {/* Back */}
          <Link
            href="/dashboard/bookings"
            className="group flex h-11 w-full items-center justify-center gap-2 border border-white/[0.1] text-sm font-medium text-zinc-400 transition-colors hover:border-white/[0.18] hover:text-white"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              strokeWidth={1.8}
            />
            Back to my bookings
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BookingDetailsPage;
