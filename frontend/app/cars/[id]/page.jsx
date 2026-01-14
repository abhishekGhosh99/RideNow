import { cars } from "@/lib/carData";
import Link from "next/link";

export default function CarDetailPage({ params }) {
  const car = cars.find((c) => c.id === params.id);

  if (!car) return <div className="text-white p-10">Car not found</div>;

  return (
    <section className="min-h-screen bg-slate-950 px-6 py-12">
      <Link href="/cars" className="text-cyan-400">
        ← Back to cars
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <img
          src={car.image}
          alt={car.name}
          className="rounded-xl w-full object-cover"
        />

        <div>
          <h1 className="text-3xl font-bold text-white">{car.name}</h1>
          <p className="text-gray-400 mt-2">{car.description}</p>

          <div className="mt-6 space-y-2 text-white">
            <p>🚗 Type: {car.type}</p>
            <p>⚙ Transmission: {car.transmission}</p>
            <p>💺 Seats: {car.seats}</p>
            <p className="text-cyan-400 text-xl font-semibold">
              ₹{car.price}/day
            </p>
          </div>

          <button className="mt-8 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg">
            Book This Car
          </button>
        </div>
      </div>
    </section>
  );
}
