import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { http } from '../api/http.js'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix para iconos de Leaflet en React
let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow
})
L.Marker.prototype.options.icon = DefaultIcon

// 🔹 Nuevo componente que actualiza el centro
function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, 12) // centramos y hacemos zoom
    }
  }, [center, map])
  return null
}

export default function PlacesList() {
  const [data, setData] = useState([])
  const [q, setQ] = useState('')
  const [minRating, setMin] = useState('')
  const [mapCenter, setMapCenter] = useState([40.4168, -3.7038]) // Madrid por defecto
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => { load() }, [])

  async function load() {
    const r = await http(`/places?search=${encodeURIComponent(q)}&minRating=${minRating}`)
    setData(r.data.data || r.data)
  }

  // 🔹 efecto con debounce para Nominatim
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!q) {
        setSuggestions([])
        return
      }

      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=5`
        )
        const results = await r.json()
        setSuggestions(results)
      } catch (err) {
        console.error("Error Nominatim:", err)
      }
    }, 600) // espera 600ms tras dejar de escribir

    return () => clearTimeout(delayDebounce)
  }, [q])

  // 🔹 Selección de sugerencia
  function handleSelectSuggestion(s) {
    setQ(s.display_name)
    const lat = parseFloat(s.lat)
    const lon = parseFloat(s.lon)
    setMapCenter([lat, lon]) // 👈 esto ahora mueve el mapa
    setSuggestions([])
  }

  return (
    <div>
      {/* 🔹 Contenedor buscador */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-4 relative">
        <div className="flex-1">
          <label className="label">Buscar</label>
          <input
            className="input w-full"
            placeholder="Nombre, ciudad, dirección..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="absolute autocomplete-list shadow-md border rounded w-full max-h-48 overflow-y-auto bg-white z-50">
              {suggestions.map(s => (
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

        <div className="w-full sm:w-40">
          <label className="label">Nota mínima</label>
          <input
            className="input w-full"
            placeholder="Ej. 3.5"
            value={minRating}
            onChange={e => setMin(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-full sm:w-auto" onClick={load}>
          Buscar
        </button>
      </div>

      {/* 🔹 Mapa */}
      <div className="h-64 sm:h-96 card overflow-hidden mb-6">
        <MapContainer
          center={mapCenter}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapUpdater center={mapCenter} />
          {data.map(p => (
            p.location && p.location.coordinates ? (
              <Marker key={p._id} position={[p.location.coordinates[1], p.location.coordinates[0]]}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">{p.title}</h3>
                    <button
                      className="btn btn-primary text-sm"
                      onClick={() => window.location.href = `/places/${p._id}`}
                    >
                      Ver detalle
                    </button>
                  </div>
                </Popup>
              </Marker>
            ) : null
          ))}
        </MapContainer>
      </div>

      {/* 🔹 Lista de lugares */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {data.map(p => (
          <Link key={p._id} to={`/places/${p._id}`} className="card p-4 hover:shadow-md transition">
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{p.description}</p>
            <div className="mt-3 text-sm">
              ⭐ {Number(p.avgRating || 0).toFixed(1)}
              <span className="text-neutral-500"> ({p.reviewsCount})</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
