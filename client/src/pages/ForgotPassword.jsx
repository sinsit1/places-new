import React, { useState } from "react"
import { http } from "../api/http.js"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await http("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      })
      setMessage("Si existe una cuenta con ese email, recibirás instrucciones para recuperar tu contraseña.")
    } catch (err) {
      setError(err.error || "Error al solicitar recuperación")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Recuperar contraseña</h2>
        {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-full">Enviar instrucciones</button>
        </form>
      </div>
    </div>
  )
}
