import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register(){
  const { register } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const onSubmit = async (e)=>{
    e.preventDefault()
    try{
      await register(name, email, password)
      nav('/')
    }catch(err){ setError(err.error || 'Error') }
  }
  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Crear cuenta</h2>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label">Nombre</label>
            <input className="input" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input className="input" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary w-full">Registrarme</button>
        </form>
      </div>
    </div>
  )
}
