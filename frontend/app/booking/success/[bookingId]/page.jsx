"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Loader2,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getImage = (car) => {
  if (Array.isArray(car?.images) && car.images.length > 0) {
    const firstImage = car.images.find((image) =>
      typeof image === "string" ? image : image?.url || image?.src,
    );

    if (typeof firstImage === "string") return firstImage;

    return firstImage?.url || firstImage?.src || "";
  }

  return car?.image || "";
};

const formatLocation = (location) => {
  if (!location) return "—";
  if (typeof location === "string") return location;

  return (
    [location.address, location.city, location.zipCode]
      .filter(Boolean)
      .join(", ") || "—"
  );
};

const SuccessPage = () => {
  const params = useParams();
  const { authFetch, loading: authLoading } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await authFetch(`/bookings/${params.bookingId}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load booking.");
        }

        setBooking(data.data);
      } catch (err) {
        console.error("Success page error:", err);

        setError(
          err instanceof Error ? err.message : "Unable to load booking.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.bookingId && !authLoading) {
      fetchBooking();
    }
  }, [params.bookingId, authLoading, authFetch]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090B] pt-[76px]">
        <div className="flex min-h-[75vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#D4AF5A]" />
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-[#09090B] px-6 pt-[120px]">
        <div className="mx-auto max-w-xl border border-[#27272A] bg-[#111113] p-8 text-center">
          <h1 className="text-xl font-semibold">Booking unavailable</h1>

          <p className="mt-3 text-sm text-[#A1A1AA]">
            {error || "We couldn't find this booking."}
          </p>

          <Link
            href="/dashboard/bookings"
            className="mt-6 inline-flex h-11 items-center gap-2 bg-[#D4AF5A] px-5 text-sm font-semibold text-[#09090B]"
          >
            View bookings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  const car = booking.car;

  const image = getImage(car) || "/images/car-placeholder.jpg";

  const total = Number(booking.pricing?.totalAmount || 0);

  return (
    <main className="min-h-screen bg-[#09090B] pt-[76px] text-[#F4F4F5]">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        {/* Confirmation */}
        <section className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#D4AF5A]/30 bg-[#D4AF5A]/10">
            <CheckCircle2 className="h-8 w-8 text-[#D4AF5A]" />
          </div>

          <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF5A]">
            Reservation confirmed
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            You're all set.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#A1A1AA]">
            Your RideNow reservation has been confirmed and your payment was
            successfully processed.
          </p>

          {booking.bookingNumber && (
            <p className="mt-6 text-sm text-[#71717A]">
              Booking{" "}
              <span className="font-medium text-[#F4F4F5]">
                #{booking.bookingNumber}
              </span>
            </p>
          )}
        </section>

        {/* Booking card */}
        <section className="mt-12 border border-[#27272A] bg-[#111113]">
          <div className="grid md:grid-cols-[260px_1fr]">
            <div className="h-64 md:h-full">
              <img
                src={image}
                alt={car?.name || "Rental car"}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#71717A]">
                    Your vehicle
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    {car?.name || "RideNow vehicle"}
                  </h2>

                  {car?.brand && (
                    <p className="mt-1 text-sm text-[#A1A1AA]">{car.brand}</p>
                  )}
                </div>

                <CarFront className="h-5 w-5 text-[#D4AF5A]" />
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="flex gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF5A]" />

                  <div>
                    <p className="text-xs text-[#71717A]">Rental period</p>

                    <p className="mt-1 text-sm">
                      {formatDate(booking.startDate)}
                    </p>

                    <p className="text-sm text-[#A1A1AA]">
                      to {formatDate(booking.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF5A]" />

                  <div>
                    <p className="text-xs text-[#71717A]">Pickup location</p>

                    <p className="mt-1 text-sm">
                      {formatLocation(booking.pickupLocation)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between border-t border-[#27272A] pt-6">
                <div>
                  <p className="text-xs text-[#71717A]">Payment status</p>

                  <p className="mt-1 text-sm font-medium text-[#D4AF5A]">
                    Paid
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[#71717A]">Total paid</p>

                  <p className="mt-1 text-2xl font-semibold">
                    ₹{total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/bookings"
            className="inline-flex h-12 items-center justify-center gap-2 bg-[#D4AF5A] px-6 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#E0BE70]"
          >
            View my bookings
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/cars"
            className="inline-flex h-12 items-center justify-center border border-[#27272A] bg-[#111113] px-6 text-sm font-medium text-[#F4F4F5] transition-colors hover:border-[#3F3F46]"
          >
            Browse more cars
          </Link>
        </div>

        <p className="mt-10 text-center text-xs text-[#52525B]">
          Keep your booking number handy for your rental.
        </p>
      </div>
    </main>
  );
};

export default SuccessPage;
