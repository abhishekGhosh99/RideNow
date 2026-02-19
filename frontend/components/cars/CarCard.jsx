"use client";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CarCard({ car }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? car.images.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === car.images.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/40 to-slate-900/60 rounded-2xl border border-cyan-400/20 group-hover:border-cyan-400/50 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-cyan-500/10"></div>

      <div className="relative p-5 flex flex-col h-full space-y-4">
        <div className="relative overflow-hidden rounded-xl bg-zinc-100 h-48 group">
          <img
            src={car.images[currentImageIndex] || "/placeholder.svg"}
            alt={`${car.name} - ${currentImageIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>

          <button
            onClick={handlePrevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {car.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-cyan-400 w-6"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
            {car.name}
          </h3>

          <div className="inline-flex items-center">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-300">
              {car.category}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
            <div className="space-y-1">
              <p className="text-xs text-slate-400">Per Day</p>
              <p className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {car.pricePerDay}
              </p>
            </div>

            <Link href="/booking">
              <button className="group/btn inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Rent</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
