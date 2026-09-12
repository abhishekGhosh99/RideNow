"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Fuel,
  Gauge,
  Users,
} from "lucide-react";

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

export default function CarCard({ car }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = Array.isArray(car?.images) ? car.images : [];
  const image = getImage(car);
  const price = getPrice(car);

  const handlePrevImage = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const carId = car?._id || car?.id;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113]"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-[#18181B]">
        {image ? (
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            src={image}
            alt={`${car?.name || "Rental car"} — view ${currentImageIndex + 1}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Gauge className="h-10 w-10 text-zinc-700" />
          </div>
        )}

        {/* Category */}
        {car?.category && (
          <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-[#09090B]/85 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-300 backdrop-blur-sm">
            {car.category}
          </div>
        )}

        {/* Image Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#09090B]/80 text-white opacity-0 transition-all duration-200 hover:bg-[#18181B] group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#09090B]/80 text-white opacity-0 transition-all duration-200 hover:bg-[#18181B] group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? "w-5 bg-[#D4AF5A]"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <div className="border-b border-white/[0.07] pb-4">
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-white">
            {car?.name || "Premium Vehicle"}
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            {car?.brand || "RideNow"}
            {car?.model ? ` • ${car.model}` : ""}
            {car?.year ? ` • ${car.year}` : ""}
          </p>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-3 border-b border-white/[0.07] py-4">
          <div className="border-r border-white/[0.07] pr-3">
            <div className="flex items-center gap-1.5 text-zinc-600">
              <Gauge className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-[0.1em]">
                Gear
              </span>
            </div>

            <p className="mt-1.5 truncate text-xs capitalize text-zinc-300">
              {car?.specifications?.transmission ||
                car?.transmission ||
                "Automatic"}
            </p>
          </div>

          <div className="border-r border-white/[0.07] px-3">
            <div className="flex items-center gap-1.5 text-zinc-600">
              <Fuel className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-[0.1em]">
                Fuel
              </span>
            </div>

            <p className="mt-1.5 truncate text-xs capitalize text-zinc-300">
              {car?.specifications?.fuelType || car?.fuelType || "Petrol"}
            </p>
          </div>

          <div className="pl-3">
            <div className="flex items-center gap-1.5 text-zinc-600">
              <Users className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-[0.1em]">
                Seats
              </span>
            </div>

            <p className="mt-1.5 text-xs text-zinc-300">
              {car?.specifications?.seats || car?.seats || 5}
            </p>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
              From
            </p>

            <p className="mt-1 text-lg font-semibold text-white">
              ₹{Number(price).toLocaleString("en-IN")}
              <span className="ml-1 text-xs font-normal text-zinc-500">
                / day
              </span>
            </p>
          </div>

          <Link
            href={`/cars/${carId}`}
            className="group/button inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/[0.1] px-4 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-[#D4AF5A]/50 hover:bg-[#18181B] hover:text-white"
          >
            View car
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-1 group-hover/button:text-[#D4AF5A]" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
