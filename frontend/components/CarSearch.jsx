"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Search,
  ArrowRight,
  CarFront,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const formatDate = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

const getImage = (car) => {
  if (Array.isArray(car.images) && car.images.length > 0) {
    const firstImage = car.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    return firstImage?.url || firstImage?.src || "";
  }

  return car.image || "";
};

const getPrice = (car) => {
  return (
    car.pricing?.perDay ??
    car.pricing?.dailyRate ??
    car.pricing?.pricePerDay ??
    car.pricePerDay ??
    car.price ??
    0
  );
};

const CarSearch = () => {
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");

  const [cars, setCars] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSearch = async (event) => {
    event.preventDefault();

    setError("");
    setCars([]);

    if (!location.trim()) {
      setError("Please enter a destination.");
      return;
    }

    if (!pickupDate || !dropoffDate) {
      setError("Please select both rental dates.");
      return;
    }

    if (pickupDate < today) {
      setError("Pick-up date cannot be in the past.");
      return;
    }

    if (dropoffDate <= pickupDate) {
      setError("Drop-off date must be after the pick-up date.");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams({
        destination: location.trim(),
        startDate: pickupDate,
        endDate: dropoffDate,
      });

      const response = await fetch(
        `${API_URL}/cars/search?${params.toString()}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to search cars.");
      }

      setCars(data.data || []);
    } catch (err) {
      setError(err.message || "Something went wrong while searching for cars.");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setLocation("");
    setPickupDate("");
    setDropoffDate("");
    setCars([]);
    setSearched(false);
    setError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-[#111113]"
    >
      <div className="px-6 py-8 sm:px-8 sm:py-10 lg:px-12">
        {/* Header */}
        <div className="relative mb-8 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF5A]">
            Find your ride
          </p>

          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
            Where are you heading?
          </h2>

          <p className="mt-2 text-sm text-zinc-500 sm:text-base">
            Choose your location and dates to find available cars.
          </p>

          {/* Clear search */}
          {searched && (
            <button
              type="button"
              onClick={clearSearch}
              className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
            >
              <X className="h-4 w-4" />
              Clear search
            </button>
          )}
        </div>

        <form onSubmit={handleSearch}>
          {/* Destination + Dates */}
          <div className="grid gap-3 lg:grid-cols-3">
            {/* Destination */}
            <label className="group rounded-2xl border border-white/10 bg-[#18181B] px-4 py-4 transition-colors focus-within:border-[#D4AF5A]/60">
              <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">
                <MapPin className="h-3.5 w-3.5 text-[#D4AF5A]" />
                Destination
              </span>

              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City, airport or location"
                className="mt-2 w-full bg-transparent text-base text-white outline-none placeholder:text-zinc-600"
              />
            </label>

            {/* Pick-up */}
            <label className="group rounded-2xl border border-white/10 bg-[#18181B] px-4 py-4 transition-colors focus-within:border-[#D4AF5A]/60">
              <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">
                <CalendarDays className="h-3.5 w-3.5 text-[#D4AF5A]" />
                Pick-up
              </span>

              <input
                type="date"
                min={today}
                value={pickupDate}
                onChange={(event) => {
                  setPickupDate(event.target.value);

                  if (dropoffDate && event.target.value >= dropoffDate) {
                    setDropoffDate("");
                  }
                }}
                className="mt-2 w-full bg-transparent text-base text-white outline-none [color-scheme:dark]"
              />
            </label>

            {/* Drop-off */}
            <label className="group rounded-2xl border border-white/10 bg-[#18181B] px-4 py-4 transition-colors focus-within:border-[#D4AF5A]/60">
              <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">
                <CalendarDays className="h-3.5 w-3.5 text-[#D4AF5A]" />
                Drop-off
              </span>

              <input
                type="date"
                min={pickupDate || today}
                value={dropoffDate}
                onChange={(event) => setDropoffDate(event.target.value)}
                className="mt-2 w-full bg-transparent text-base text-white outline-none [color-scheme:dark]"
              />
            </label>
          </div>

          {/* Search Button */}
          <div className="mt-4 flex justify-center">
            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="flex min-h-[60px] w-full max-w-[360px] items-center justify-center gap-3 rounded-2xl bg-[#D4AF5A] px-8 text-base font-semibold text-[#09090B] transition-colors hover:bg-[#E0BE70] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[64px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching
                </>
              ) : (
                <>
                  Search cars
                  <Search className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}

        {/* Search Results */}
        <AnimatePresence>
          {searched && !loading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.45 }}
              className="border-t border-white/[0.07] px-6 py-8 sm:px-8 sm:py-10 lg:px-12"
            >
              {/* Results header */}
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#D4AF5A]">
                    Available vehicles
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-white">
                    Cars in {location}
                  </h3>
                </div>

                <p className="text-sm text-zinc-500">
                  {cars.length} {cars.length === 1 ? "vehicle" : "vehicles"}{" "}
                  available
                </p>
              </div>

              {/* No results */}
              {cars.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.07] bg-[#18181B] px-6 py-12 text-center">
                  <CarFront className="mx-auto h-10 w-10 text-zinc-600" />

                  <h4 className="mt-4 text-lg font-medium text-white">
                    No cars available
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                    We couldn't find any available cars in {location} for your
                    selected dates. Try another destination or different dates.
                  </p>
                </div>
              ) : (
                /* Car cards */
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {cars.map((car, index) => {
                    const image = getImage(car);
                    const price = getPrice(car);

                    return (
                      <motion.article
                        key={car._id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.45,
                          delay: index * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ y: -3 }}
                        className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113] transition-colors duration-300 hover:border-white/[0.14]"
                      >
                        {/* Car image */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-[#18181B]">
                          {image ? (
                            <img
                              src={image}
                              alt={car.name || "Rental car"}
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <CarFront className="h-10 w-10 text-zinc-700" />
                            </div>
                          )}

                          {/* Category */}
                          <div className="absolute left-4 top-4 rounded-md border border-white/10 bg-[#09090B]/85 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-300 backdrop-blur-sm">
                            {car.category || "Vehicle"}
                          </div>

                          {/* Rating */}
                          {car.averageRating && (
                            <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-md border border-white/10 bg-[#09090B]/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                              <span className="text-[#D4AF5A]">★</span>

                              {typeof car.averageRating === "number"
                                ? car.averageRating.toFixed(1)
                                : car.averageRating}
                            </div>
                          )}
                        </div>

                        {/* Car information */}
                        <div className="p-5">
                          <h4 className="text-xl font-semibold tracking-[-0.025em] text-white">
                            {car.name ||
                              `${car.brand || ""} ${car.model || ""}`.trim() ||
                              "Premium Vehicle"}
                          </h4>

                          <p className="mt-1 text-sm text-zinc-500">
                            {car.brand || "RideNow"}
                            {car.model ? ` • ${car.model}` : ""}
                            {car.year ? ` • ${car.year}` : ""}
                          </p>

                          {/* Specifications */}
                          <div className="mt-5 grid grid-cols-3 border-y border-white/[0.07] py-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                                Transmission
                              </p>

                              <p className="mt-1 text-sm text-zinc-300">
                                {car.specifications?.transmission ||
                                  "Automatic"}
                              </p>
                            </div>

                            <div className="border-l border-white/[0.07] pl-4">
                              <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                                Fuel
                              </p>

                              <p className="mt-1 text-sm text-zinc-300">
                                {car.specifications?.fuelType || "Petrol"}
                              </p>
                            </div>

                            <div className="border-l border-white/[0.07] pl-4">
                              <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                                Seats
                              </p>

                              <p className="mt-1 text-sm text-zinc-300">
                                {car.specifications?.seats || 5}
                              </p>
                            </div>
                          </div>

                          {/* Price + CTA */}
                          <div className="mt-5 flex items-end justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                                From
                              </p>

                              <p className="mt-1 text-xl font-semibold tracking-[-0.02em] text-white">
                                ₹{Number(price).toLocaleString("en-IN")}
                                <span className="ml-1 text-xs font-normal text-zinc-500">
                                  / day
                                </span>
                              </p>
                            </div>

                            <Link
                              href={`/cars/${car._id}?startDate=${pickupDate}&endDate=${dropoffDate}&location=${encodeURIComponent(
                                location,
                              )}`}
                              className="group/link inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-[#D4AF5A]/50 hover:text-[#D4AF5A]"
                            >
                              View car
                              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CarSearch;
