"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";
import CarCard from "@/components/cars/CarCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/cars?limit=50`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch cars");
        }

        setCars(data.data || []);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError(error.message || "Unable to load cars.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((car) => {
        const name = car.name?.toLowerCase() || "";
        const brand = car.brand?.toLowerCase() || "";
        const model = car.model?.toLowerCase() || "";
        const categoryName = car.category?.toLowerCase() || "";

        return (
          name.includes(query) ||
          brand.includes(query) ||
          model.includes(query) ||
          categoryName.includes(query)
        );
      });
    }

    // Category
    if (category !== "all") {
      result = result.filter(
        (car) => car.category?.toLowerCase() === category.toLowerCase(),
      );
    }

    // Sorting
    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.pricing?.perDay || 0) - Number(b.pricing?.perDay || 0),
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.pricing?.perDay || 0) - Number(a.pricing?.perDay || 0),
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) => Number(b.averageRating || 0) - Number(a.averageRating || 0),
      );
    }

    if (sort === "featured") {
      result.sort(
        (a, b) => Number(b.isFeatured || false) - Number(a.isFeatured || false),
      );
    }

    return result;
  }, [cars, search, category, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("featured");
  };

  return (
    <main className="min-h-screen bg-[#09090B] px-5 pb-20 pt-32 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-10"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF5A]">
            Our fleet
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#F4F4F5] sm:text-4xl">
                Find the right car for your journey
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#71717A] sm:text-base">
                Browse our available vehicles and choose the one that fits your
                trip.
              </p>
            </div>

            {!loading && (
              <p className="text-sm text-[#71717A]">
                {filteredCars.length}{" "}
                {filteredCars.length === 1 ? "vehicle" : "vehicles"}
              </p>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="mb-10 rounded-2xl border border-white/[0.08] bg-[#111113] p-4"
        >
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by brand, model or car name..."
                className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#18181B] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-[#52525B] focus:border-[#D4AF5A]/60"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-12 min-w-[170px] appearance-none rounded-xl border border-white/[0.08] bg-[#18181B] pl-10 pr-8 text-sm text-[#F4F4F5] outline-none focus:border-[#D4AF5A]/60"
              >
                <option value="all">All categories</option>
                <option value="economy">Economy</option>
                <option value="standard">Standard</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-12 min-w-[170px] rounded-xl border border-white/[0.08] bg-[#18181B] px-4 text-sm text-[#F4F4F5] outline-none focus:border-[#D4AF5A]/60"
            >
              <option value="featured">Featured</option>
              <option value="rating">Top rated</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
            </select>

            {/* Clear */}
            {(search || category !== "all" || sort !== "featured") && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 text-sm text-[#A1A1AA] transition-colors hover:border-white/15 hover:text-white"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-[#71717A]">
              <Loader2 className="h-5 w-5 animate-spin text-[#D4AF5A]" />
              Loading vehicles...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] px-6 py-12 text-center">
            <h2 className="text-lg font-medium text-white">
              Unable to load vehicles
            </h2>

            <p className="mt-2 text-sm text-[#71717A]">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-[#D4AF5A] px-5 py-2.5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#E0BE70]"
            >
              Try again
            </button>
          </div>
        )}

        {/* Cars */}
        {!loading && !error && (
          <>
            {filteredCars.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#111113] px-6 py-16 text-center">
                <h2 className="text-lg font-medium text-white">
                  No vehicles found
                </h2>

                <p className="mt-2 text-sm text-[#71717A]">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 text-sm font-medium text-[#D4AF5A] hover:text-[#E0BE70]"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredCars.map((car, index) => (
                  <motion.div
                    key={car._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(index * 0.04, 0.3),
                    }}
                  >
                    <CarCard car={car} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default CarsPage;
