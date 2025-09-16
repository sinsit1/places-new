import React, { useEffect, useState } from "react";
import { http } from "../api/http.js";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// 🔹 Fix para iconos de Leaflet en React
let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

// 🔹 Componente auxiliar que actualiza el centro del mapa
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 12);
    }
  }, [center, map]);
  return null;
}

export default function PlacesMap() {
  const [places, setPlaces] = useState([]);
  const [q, setQ] = useState("");
  const [mapCenter, setMapCenter] = useState([40.4168, -3.7038]); // Madrid por defecto
  const [suggestions, setSuggestions] = useState([]);

  // 📌 cargar lugares desde la BD
  useEffect(() => {
    loadPlaces();
  }, []);

  async function loadPlaces() {
    try {
      const r = await http("/places");
      setPlaces(r.data || r); // depende de cómo responda tu API
    } catch (err) {
      console.error("Error cargando lugares:", err);
    }
  }

  // 📌 efecto con debounce para Nominatim
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!q) {
        setSuggestions([]);
        return;
      }
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            q
          )}&addressdetails=1&limit=5`
        );
        const results = await r.json();
        setSuggestions(results);
      } catch (err) {
        console.error("Error Nominatim:", err);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [q]);

  // 📌 Selección de sugerencia
  function handleSelectSuggestion(s) {
    setQ(s.display_name);
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);
    setMapCenter([lat, lon]);
    setSuggestions([]);
  }

  return (
    <div className="container space-y-4">
      {/* Buscador */}
      <div className="relative">
        <label className="label">Buscar ubicación</label>
        <input
          className="input"
          placeholder="Nombre, ciudad, dirección..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border rounded shadow w-full max-h-48 overflow-y-auto z-50">
            {suggestions.map((s) => (
              <li
                key={s.place_id}
                className="p-2 hover:bg-neutral-100 cursor-pointer text-sm"
                onClick={() => handleSelectSuggestion(s)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mapa */}
      <div className="h-[70vh] card overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapUpdater center={mapCenter} />

          {/* 🔹 Marcadores desde la BD */}
          {places.map(
            (p) =>
              p.location?.coordinates && (
                <Marker
                  key={p._id}
                  position={[
                    p.location.coordinates[1],
                    p.location.coordinates[0],
                  ]}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold mb-2">{p.title}</h3>
                      <p className="text-sm mb-2">{p.description}</p>
                      <button
                        className="btn btn-primary text-sm"
                        onClick={() =>
                          (window.location.href = `/places/${p._id}`)
                        }
                      >
                        Ver detalle
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
}
