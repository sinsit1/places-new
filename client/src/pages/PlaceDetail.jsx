import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http } from "../api/http.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../context/AuthContext.jsx";

export default function PlaceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [place, setPlace] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await http(`/places/${id}`);
    setPlace(r.place);

    try {
      const favs = await http("/users/me/favorites");
      setIsFavorite(favs.data.some((f) => f._id === id));
    } catch (err) {
      console.error("Error cargando favoritos", err);
    }
  }

  async function toggleFavorite() {
    try {
      if (isFavorite) {
        await http(`/favorites/${id}`, { method: "DELETE" });
        setIsFavorite(false);
      } else {
        await http(`/favorites/${id}`, { method: "POST" });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error al cambiar favorito", err);
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    try {
      await http(`/places/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          rating: newRating,
          comment: newComment,
        }),
      });
      setShowModal(false);
      setNewRating(5);
      setNewComment("");
      await load(); // recarga opiniones
    } catch (err) {
      console.error("Error al enviar opinión", err);
    }
  }

  if (!place) return <p>Cargando...</p>;

  // ✅ comprobamos si el usuario ya ha opinado
  const alreadyReviewed =
    user &&
    place.reviews?.some(
      (r) => r.user?._id === user.id || r.user?._id === user._id
    );

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Columna izquierda */}
      <div className="lg:col-span-2 space-y-6">
        {/* Cabecera */}
        <div className="card p-6">
          <h1 className="text-2xl font-bold">{place.title}</h1>
          <p className="text-neutral-600 mb-3">{place.description}</p>

          <div className="flex items-center gap-2 text-yellow-500 font-semibold">
            ⭐ {Number(place.avgRating || 0).toFixed(1)}
            <span className="text-neutral-500">
              ({place.reviewsCount} opiniones)
            </span>
          </div>
        </div>

        {/* Opiniones */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Opiniones</h2>
            {!alreadyReviewed ? (
              <button
                className="btn btn-primary text-sm"
                onClick={() => setShowModal(true)}
              >
                ➕ Añadir opinión
              </button>
            ) : (
              <span className="badge bg-green-100 text-green-700">
                ✅ Ya has opinado sobre este lugar
              </span>
            )}
          </div>

          {place.reviews?.length === 0 && (
            <p className="text-neutral-500">Aún no hay opiniones.</p>
          )}

          <div className="space-y-4">
            {place.reviews?.map((r) => (
              <div key={r._id} className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{r.user?.name}</div>
                  <div className="text-sm text-neutral-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-yellow-500">⭐ {r.rating}</div>
                <p className="text-neutral-700">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-3">Información</h3>
          <p>
            <strong>Dirección:</strong> {place.address || "No disponible"}
          </p>
          {place.location?.coordinates && (
            <div className="my-3">
              <MapContainer
                center={[
                  place.location.coordinates[1],
                  place.location.coordinates[0],
                ]}
                zoom={14}
                style={{ height: "200px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[
                    place.location.coordinates[1],
                    place.location.coordinates[0],
                  ]}
                >
                  <Popup>{place.title}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
          {/* Botón favoritos */}
          <button
            className={`btn w-full ${
              isFavorite ? "btn-secondary" : "btn-primary"
            }`}
            onClick={toggleFavorite}
          >
            {isFavorite ? "⭐ Quitar de favoritos" : "⭐ Añadir a favoritos"}
          </button>
        </div>
      </div>

      {/* Modal opinión */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Añadir opinión</h2>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="label">Puntuación</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Comentario</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="input"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
