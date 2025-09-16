import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login(){
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const onSubmit = async (e)=>{
    e.preventDefault()
    try{
      await login(email, password)
      nav('/')
    }catch(err){ 
      setError(err.error || 'Error al iniciar sesión') 
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label">Email</label>
            <input 
              className="input" 
              placeholder="Email" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input 
              className="input" 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
            />
          </div>
          <button className="btn btn-primary w-full">Entrar</button>
        </form>

        {/* Enlace de recuperación */}
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  )
}
