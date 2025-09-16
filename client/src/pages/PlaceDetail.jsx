import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { http } from '../api/http.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function PlaceDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [place, setPlace] = useState(null)
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => { load() }, [id])

  async function load() {
    const r = await http(`/places/${id}`)
    setPlace(r.place)
  }

  async function submitReview(e) {
    e.preventDefault()
    await http(`/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        rating: Number(rating),
        comment,
        place: id   // 🔹 Importante: el ID del lugar
      })
    })
    setRating('')
    setComment('')
    await load() // 🔹 refrescar lugar para traer nuevas reviews
  }

  if (!place) return <p>Cargando...</p>

  const hasReviewed = user && place.reviews?.some(r => String(r.author?._id) === String(user.id))

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Info del lugar */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-2">{place.title}</h2>
        <p className="mb-2">{place.description}</p>
        <span className="badge">Ubicación</span> {place.locationName || ''}
        <div className="mt-3 text-sm">
          ⭐ {Number(place.avgRating || 0).toFixed(1)} 
          <span className="text-neutral-500"> ({place.reviewsCount})</span>
        </div>
      </div>

      {/* Opiniones y formulario en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Opiniones */}
        <div className="card p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Opiniones</h3>
          {place.reviews?.length === 0 && (
            <p className="text-neutral-500">No hay opiniones aún</p>
          )}
          <div className="space-y-4">
            {place.reviews?.map(r => (
              <div key={r._id} className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{r.author?.name || 'Anónimo'}</span>
                  <span className="text-sm text-neutral-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-yellow-600">⭐ {r.rating}</div>
                <p className="mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div>
          {!hasReviewed && user && (
            <form onSubmit={submitReview} className="card p-6 space-y-4">
              <h3 className="text-lg font-semibold">Añadir opinión</h3>
              <div>
                <label className="label">Nota (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="input"
                  value={rating}
                  onChange={e => setRating(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Comentario</label>
                <input
                  className="input"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-primary">Enviar</button>
            </form>
          )}

          {hasReviewed && (
            <div className="card p-4 text-center text-neutral-600">
              Ya has opinado sobre este lugar ✅
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
