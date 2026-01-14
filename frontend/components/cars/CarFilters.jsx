export default function CarFilters({ filters, setFilters }) {
  return (
    <div className="flex justify-between items-center gap-10 bg-white/5 p-4 rounded-xl border border-white/10">
      <h4 className="text-white font-semibold">Filters</h4>
      <div className="flex gap-5">
        <select
          className="bg-transparent text-white border border-white/20 rounded-lg px-3 py-2"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="" className="text-black">
            All Types
          </option>
          <option value="SUV" className="text-black">
            SUV
          </option>
          <option value="Sedan" className="text-black">
            Sedan
          </option>
          <option value="Luxury" className="text-black">
            Luxury
          </option>
          <option value="Electric" className="text-black">
            Electric
          </option>
        </select>

        <select
          className="bg-transparent text-white border border-white/20 rounded-lg px-3 py-2"
          value={filters.transmission}
          onChange={(e) =>
            setFilters({ ...filters, transmission: e.target.value })
          }
        >
          <option value="" className="text-black">
            All Transmissions
          </option>
          <option value="Automatic" className="text-black">
            Automatic
          </option>
          <option value="Manual" className="text-black">
            Manual
          </option>
        </select>
      </div>
    </div>
  );
}
