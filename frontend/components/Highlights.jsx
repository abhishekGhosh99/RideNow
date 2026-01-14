"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cars } from "@/lib/carData";
import CarCard from "@/components/cars/CarCard";

const Highlights = () => {
  return (
    <section
      className="scroll-mt-24 relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      id="highlights"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 rounded-full px-4 py-2">
            <span className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider">
              Our Fleet
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">
            <span className="bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Premium Car Collection
            </span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto text-balance font-medium">
            Explore our handpicked selection of premium vehicles for every need
            and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.slice(0, 8).map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link
            href="/cars"
            className="text-white font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            <button className="flex justify-center items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500">
              Show all cars
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
