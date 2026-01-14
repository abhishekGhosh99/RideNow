"use client";
import { useState } from "react";
import { cars } from "@/lib/carData";
import CarFilters from "@/components/cars/CarFilters";
import CarGrid from "@/components/cars/CarGrid";
import Navbar from "@/components/Navbar";

export default function CarsPage() {
  const [filters, setFilters] = useState({ category: "", transmission: "" });

  const filteredCars = cars.filter((car) => {
    return (
      (!filters.category ||
        car.category.toLowerCase() === filters.category.toLowerCase()) &&
      (!filters.transmission ||
        car.transmission.toLowerCase() === filters.transmission.toLowerCase())
    );
  });

  const showEmptyState = filteredCars.length === 0;
  let emptyMessage = "No cars available";

  if (showEmptyState) {
    if (filters.category && filters.transmission) {
      emptyMessage = `${filters.transmission} ${filters.category} cars are not available`;
    } else if (filters.category) {
      emptyMessage = `${filters.category} cars are not available`;
    } else if (filters.transmission) {
      emptyMessage = `${filters.transmission} cars are not available`;
    }
  }

  return (
    <>
      <Navbar showLinks={false} showBookButton={false} showBackButton={true} />
      <section className="flex flex-col gap-5 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900 p-12">
        <h1 className="text-3xl font-bold text-white text-center">
          Available Cars
        </h1>

        <CarFilters filters={filters} setFilters={setFilters} />

        {showEmptyState ? (
          <p className="text-center text-gray-300 text-lg mt-10">
            {emptyMessage}
          </p>
        ) : (
          <CarGrid cars={filteredCars} />
        )}
      </section>
    </>
  );
}
