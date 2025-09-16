import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { http } from "../api/http.js"

export default function ResetPassword() {
  const { token } = useParams()
  const nav = useNavigate()
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await http(`/auth/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({ password })
      })
      alert("Contraseña restablecida correctamente ✅")
      nav("/login")
    } catch (err) {
      setError(err.error || "Error al restablecer contraseña")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Nueva contraseña</h2>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label">Nueva contraseña</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-full">Cambiar contraseña</button>
        </form>
      </div>
    </div>
  )
}
