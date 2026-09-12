"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  Fuel,
  Gauge,
  MapPin,
  Users,
  CalendarDays,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

const getDays = (startDate, endDate) => {
  if (!startDate || !endDate) return null;

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  const difference = end.getTime() - start.getTime();
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return days > 0 ? days : null;
};

/* -------------------------------------------------------------------------- */
/* Car Image                                                                  */
/* -------------------------------------------------------------------------- */

const CarImage = ({ image, carName }) => {
  const imageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1]);

  return (
    <div
      ref={imageRef}
      className="relative h-[420px] overflow-hidden bg-[#111113] sm:h-[500px] lg:h-[660px]"
    >
      {image ? (
        <motion.img
          src={image}
          alt={carName}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            y: imageY,
            scale: imageScale,
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#111113]">
          <CarFront className="h-16 w-16 text-zinc-800" />
        </div>
      )}

      {/* Image border */}
      <div className="pointer-events-none absolute inset-0 border border-white/[0.08]" />

      {/* Top label */}
      <div className="absolute left-5 top-5 border border-white/[0.1] bg-[#09090B]/80 px-3 py-2 backdrop-blur-sm sm:left-6 sm:top-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF5A]">
          RideNow Fleet
        </p>
      </div>

      {/* Bottom information */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
          Premium vehicle
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
          {carName}
        </h2>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Specification                                                              */
/* -------------------------------------------------------------------------- */

const Specification = ({ icon: Icon, label, value }) => {
  return (
    <div className="border-t border-white/[0.08] py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon className="h-[18px] w-[18px] text-[#D4AF5A]" />

          <span className="text-sm text-zinc-500">{label}</span>
        </div>

        <span className="text-right text-sm font-medium text-zinc-200">
          {value}
        </span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

const CarDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const location = searchParams.get("location");

  /* ------------------------------------------------------------------------ */
  /* Fetch car                                                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/cars/${params.id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load car.");
        }

        setCar(data.data);
      } catch (err) {
        setError(err.message || "Unable to load car.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCar();
    }
  }, [params.id]);

  /* ------------------------------------------------------------------------ */
  /* Loading state                                                            */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090B] text-white">
        <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-32 sm:px-8 lg:px-10">
          <div className="mb-10 h-4 w-28 animate-pulse bg-[#18181B]" />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_420px]">
            {/* Image skeleton */}
            <div className="h-[520px] animate-pulse bg-[#111113] sm:h-[620px] lg:h-[680px]" />

            {/* Content skeleton */}
            <div className="space-y-6">
              <div className="h-3 w-24 animate-pulse bg-[#18181B]" />

              <div className="h-14 w-3/4 animate-pulse bg-[#18181B]" />

              <div className="h-5 w-1/2 animate-pulse bg-[#18181B]" />

              <div className="mt-10 space-y-0">
                <div className="h-16 animate-pulse border-t border-white/[0.06]" />
                <div className="h-16 animate-pulse border-t border-white/[0.06]" />
                <div className="h-16 animate-pulse border-t border-white/[0.06]" />
                <div className="h-16 animate-pulse border-t border-white/[0.06]" />
              </div>

              <div className="h-48 animate-pulse bg-[#111113]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error state                                                              */
  /* ------------------------------------------------------------------------ */

  if (error || !car) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090B] px-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-white/[0.08] bg-[#111113]">
            <CarFront className="h-7 w-7 text-zinc-600" />
          </div>

          <p className="mt-7 text-xs font-medium uppercase tracking-[0.18em] text-[#D4AF5A]">
            Vehicle unavailable
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
            Car not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {error || "This vehicle could not be found."}
          </p>

          <Link
            href="/cars"
            className="mt-7 inline-flex h-12 items-center gap-2 bg-[#D4AF5A] px-6 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#E0BE70]"
          >
            Browse cars
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Car data                                                                 */
  /* ------------------------------------------------------------------------ */

  const image = getImage(car);
  const price = getPrice(car);

  const transmission = car.specifications?.transmission || "Automatic";

  const fuel = car.specifications?.fuelType || "Petrol";

  const seats = car.specifications?.seats || 5;

  const carName =
    car.name ||
    `${car.brand || ""} ${car.model || ""}`.trim() ||
    "Premium Vehicle";

  const rentalDays = getDays(startDate, endDate);

  const totalPrice = rentalDays ? Number(price) * rentalDays : null;

  const bookingLocation =
    location || car.location?.city || car.location?.name || "Available";

  const bookingUrl = `/booking/${car._id}?startDate=${
    startDate || ""
  }&endDate=${endDate || ""}&location=${encodeURIComponent(
    bookingLocation || "",
  )}`;

  const description =
    car.description ||
    `Experience the ${carName} with RideNow. Enjoy a comfortable, reliable and premium driving experience for your next journey.`;

  /* ------------------------------------------------------------------------ */
  /* Page                                                                      */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen overflow-hidden bg-[#09090B] text-white">
      {/* -------------------------------------------------------------------- */}
      {/* Header                                                               */}
      {/* -------------------------------------------------------------------- */}

      <section className="border-b border-white/[0.06] pt-[76px]">
        <div className="mx-auto max-w-[1440px] px-6 py-6 sm:px-8 lg:px-10">
          <Link
            href="/cars"
            className="group inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />

            <span>Back to cars</span>
          </Link>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* Main vehicle section                                                 */}
      {/* -------------------------------------------------------------------- */}

      <section>
        <div className="mx-auto max-w-[1440px] px-6 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_420px] lg:items-start">
            {/* ---------------------------------------------------------------- */}
            {/* Car image                                                        */}
            {/* ---------------------------------------------------------------- */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <CarImage image={image} carName={carName} />
            </motion.div>

            {/* ---------------------------------------------------------------- */}
            {/* Details                                                          */}
            {/* ---------------------------------------------------------------- */}

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="lg:sticky lg:top-[104px]"
            >
              {/* Eyebrow */}
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF5A]">
                Available for rental
              </p>

              {/* Title */}
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                {carName}
              </h1>

              {/* Location */}
              <div className="mt-5 flex items-center gap-2 text-sm text-zinc-500">
                <MapPin className="h-4 w-4 text-[#D4AF5A]" />

                <span>{bookingLocation}</span>
              </div>

              {/* Availability */}
              <div className="mt-7 flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-400" />

                <span className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
                  Available now
                </span>
              </div>

              {/* ---------------------------------------------------------------- */}
              {/* Specifications                                                   */}
              {/* ---------------------------------------------------------------- */}

              <div className="mt-8">
                <Specification
                  icon={Gauge}
                  label="Transmission"
                  value={transmission}
                />

                <Specification icon={Fuel} label="Fuel type" value={fuel} />

                <Specification
                  icon={Users}
                  label="Seats"
                  value={`${seats} passengers`}
                />

                <Specification
                  icon={CarFront}
                  label="Vehicle type"
                  value={car.category || "Premium"}
                />
              </div>

              {/* ---------------------------------------------------------------- */}
              {/* Rental dates                                                     */}
              {/* ---------------------------------------------------------------- */}

              <div className="mt-8 border border-white/[0.08] bg-[#111113]">
                <div className="border-b border-white/[0.08] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#D4AF5A]" />

                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                      Rental period
                    </span>
                  </div>
                </div>

                {startDate && endDate ? (
                  <div className="grid grid-cols-2">
                    <div className="border-r border-white/[0.08] px-5 py-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                        Pickup
                      </p>

                      <p className="mt-2 text-sm font-medium text-zinc-200">
                        {formatDate(startDate)}
                      </p>
                    </div>

                    <div className="px-5 py-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                        Return
                      </p>

                      <p className="mt-2 text-sm font-medium text-zinc-200">
                        {formatDate(endDate)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-5">
                    <p className="text-sm leading-6 text-zinc-500">
                      Choose your rental dates during the booking process.
                    </p>
                  </div>
                )}
              </div>

              {/* ---------------------------------------------------------------- */}
              {/* Price                                                            */}
              {/* ---------------------------------------------------------------- */}

              <div className="mt-8 border-t border-white/[0.08] pt-7">
                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">
                      Rental rate
                    </p>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-semibold tracking-[-0.04em] text-white">
                        ₹{Number(price).toLocaleString("en-IN")}
                      </span>

                      <span className="text-sm text-zinc-500">/ day</span>
                    </div>
                  </div>

                  {totalPrice && (
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">
                        Estimated total
                      </p>

                      <p className="mt-2 text-xl font-semibold text-white">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ---------------------------------------------------------------- */}
              {/* CTA                                                              */}
              {/* ---------------------------------------------------------------- */}

              <Link
                href={bookingUrl}
                className="group mt-7 flex h-14 w-full items-center justify-between bg-[#D4AF5A] px-6 text-sm font-semibold text-[#09090B] transition-all duration-200 hover:bg-[#E0BE70]"
              >
                <span>
                  {startDate && endDate
                    ? "Continue to booking"
                    : "Book this car"}
                </span>

                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <p className="mt-3 text-center text-xs text-zinc-600">
                Review your rental details before continuing.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* About vehicle                                                        */}
      {/* -------------------------------------------------------------------- */}

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF5A]">
                The vehicle
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Built for the journey ahead.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <p className="max-w-2xl text-base leading-8 text-zinc-500">
                {description}
              </p>

              <div className="mt-10 grid grid-cols-2 border-t border-white/[0.08] sm:grid-cols-3">
                <div className="border-r border-white/[0.08] py-6 pr-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                    Transmission
                  </p>

                  <p className="mt-2 text-sm font-medium text-zinc-200">
                    {transmission}
                  </p>
                </div>

                <div className="border-r border-white/[0.08] px-5 py-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                    Fuel
                  </p>

                  <p className="mt-2 text-sm font-medium text-zinc-200">
                    {fuel}
                  </p>
                </div>

                <div className="py-6 pl-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                    Capacity
                  </p>

                  <p className="mt-2 text-sm font-medium text-zinc-200">
                    {seats} seats
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* Bottom CTA                                                           */}
      {/* -------------------------------------------------------------------- */}

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 border border-white/[0.08] bg-[#111113] p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF5A]">
                Ready to drive?
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
                Find your next car with RideNow.
              </h2>
            </div>

            <Link
              href="/cars"
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 border border-white/[0.1] px-6 text-sm font-semibold text-white transition-colors duration-200 hover:border-[#D4AF5A] hover:text-[#D4AF5A]"
            >
              View full fleet
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CarDetailPage;
