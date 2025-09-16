import React, { useState, useEffect } from "react";
import { http } from "../api/http";

export default function NewPlace() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);

  // 🔹 efecto para buscar solo cuando el usuario deja de escribir
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!address || selected?.display_name === address) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Error buscando direcciones:", err);
      }
    }, 600); // espera 600ms tras dejar de escribir

    return () => clearTimeout(delayDebounce);
  }, [address, selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) {
      alert("Selecciona una dirección válida");
      return;
    }

    try {
      await http("/places", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          location: {
            type: "Point",
            coordinates: [parseFloat(selected.lon), parseFloat(selected.lat)], // OJO: [lon, lat]
          },
        }),
      });

      alert("Lugar enviado correctamente ✅");
      setTitle("");
      setDescription("");
      setAddress("");
      setSelected(null);
      setSuggestions([]);
    } catch (err) {
      alert("Hubo un error al enviar el lugar: " + (err.error || err.message));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-6 max-w-xl mx-auto relative"
    >
      <h2 className="text-xl font-bold mb-4">Proponer lugar</h2>

      <label className="label">Título</label>
      <input
        className="input mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="label">Descripción</label>
      <textarea
        className="input mb-3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="label">Dirección</label>
      <input
        className="input mb-2"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          setSelected(null); // limpiar selección al cambiar
        }}
      />

      {/* Sugerencias debajo del input */}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded shadow w-full max-h-60 overflow-y-auto z-50">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelected(s);
                setAddress(s.display_name);
                setSuggestions([]);
              }}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}

      <button type="submit" className="btn btn-primary mt-4">
        Enviar
      </button>
    </form>
  );
}
