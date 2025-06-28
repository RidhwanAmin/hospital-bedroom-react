// MapView.tsx
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({
  geoData,
  onEachState,
  style,
}: {
  geoData: any;
  onEachState: any;
  style: any;
}) {
  return (
    <MapContainer
      center={[4.5, 109.5]}
      zoom={6}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={geoData} style={style} onEachFeature={onEachState} />
    </MapContainer>
  );
}
