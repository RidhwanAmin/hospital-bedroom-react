import { useState, lazy, Suspense } from "react";
import { Link } from "react-router";
import { statesData } from "./data";
import type { Route } from "./+types/countries";

const MapView = lazy(() => import("./MapView")); // adjust path if needed

export async function clientLoader() {
  const res = await fetch("https://api.data.gov.my/data-catalogue/?id=hospital_beds");
  const data = await res.json();

  
  return data;
}

export default function Countries({ loaderData }: Route.ComponentProps) {
  const targetDate = "2022-01-01";
  const [search, setSearch] = useState("");
  const loadData = loaderData || [];

  const malaysiaEntry = loadData.find((entry: any) =>
    entry.date === targetDate && entry.state.toLowerCase() === "malaysia"
  );
  const totalBedsMalaysia = malaysiaEntry ? parseInt(malaysiaEntry.beds, 10) : 0;

  const filteredStates = loadData.filter((entry: any) =>
    entry.date === targetDate &&
    entry.state.toLowerCase() !== "malaysia" &&
    entry.district.toLowerCase() === "all districts" &&
    entry.type.toLowerCase() === "all"
  );

  const stateStatsMap: Record<string, { beds: number; percentage: string }> = {};
  filteredStates.forEach((entry) => {
    const stateBeds = parseInt(entry.beds, 10);
    const percentage = ((stateBeds / totalBedsMalaysia) * 100).toFixed(2);
    stateStatsMap[entry.state.toLowerCase()] = {
      beds: stateBeds,
      percentage,
    };
  });

  const filteredSearchStates = filteredStates.filter((state: any) =>
    !search || state.state.toLowerCase().includes(search.toLowerCase())
  );

  const onEachState = (feature: any, layer: any) => {
    const stateName = feature.properties.name.toLowerCase();
    const stats = stateStatsMap[stateName];
    if (stats) {
      layer.bindTooltip(
        `<strong>${feature.properties.name}</strong><br>
         Beds: ${stats.beds}<br>
         % of total: ${stats.percentage}%`,
        { sticky: true }
      );
    } else {
      layer.bindTooltip(`${feature.properties.name}`, { sticky: true });
    }
  };

  const geoJsonStyle = {
    color: "#555",
    weight: 1,
    fillOpacity: 0.6,
    fillColor: "#4f46e5",
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Hospital Beds by State (2022)</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by state..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Leaflet Map (only rendered on client) */}
        <div className="w-full md:w-1/2 h-[500px]">
          {typeof window !== "undefined" && (
            <Suspense fallback={<div>Loading map...</div>}>
              <MapView geoData={statesData} onEachState={onEachState} style={geoJsonStyle} />
            </Suspense>
          )}
        </div>

        {/* Text Details */}
        <div className="w-full md:w-1/2">
          {filteredSearchStates.length === 0 ? (
            <div>No states match your filters.</div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredSearchStates.map((state: any) => {
                const name = state.state;
                const stats = stateStatsMap[name.toLowerCase()];
                return (
                  <li key={name} className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition">
                    <Link to={`/countries/${name}`} className="text-blue-600 hover:underline text-lg">
                      {name}
                    </Link>
                    <div>Number of beds: <strong>{stats.beds}</strong></div>
                    <div>Percentage of national total: <strong>{stats.percentage}%</strong></div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
