import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http.js";

export default function PlacesList() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [minRating, setMin] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const r = await http(
        `/places?search=${encodeURIComponent(q)}&minRating=${minRating}`
      );
      setData(r.data?.data || r.data || r); // depende de la forma de tu API
    } catch (err) {
      console.error("Error cargando lugares:", err);
    }
  }

  return (
    <div className="container space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-end gap-4 mb-4">
        <div className="flex-1">
          <label className="label">Buscar lugar</label>
          <input
            className="input w-full"
            placeholder="Nombre, ciudad..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="label">Nota mínima</label>
          <input
            className="input w-full"
            placeholder="Ej. 3.5"
            value={minRating}
            onChange={(e) => setMin(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-full sm:w-auto" onClick={load}>
          Filtrar
        </button>
      </div>

      {/* Lista de lugares */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {data.length === 0 && (
          <p className="text-neutral-500 col-span-full">
            No se encontraron lugares
          </p>
        )}

        {data.map((p) => (
          <Link
            key={p._id}
            to={`/places/${p._id}`}
            className="card p-4 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
              {p.description}
            </p>
            <div className="mt-3 text-sm">
              ⭐ {Number(p.avgRating || 0).toFixed(1)}
              <span className="text-neutral-500"> ({p.reviewsCount})</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
