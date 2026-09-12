import CarCard from "./CarCard";

export default function CarGrid({ cars }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}