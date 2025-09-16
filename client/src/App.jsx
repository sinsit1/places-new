import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'

export default function App(){
  const { user, logout } = useAuth();
  return (
    <div>
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur">
        <nav className="container flex items-center gap-3 py-3">
          <Link to="/" className="text-lg font-semibold">Lugares & Opiniones</Link>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/" className="btn btn-outline">Lugares</Link>
            {user && <Link to="/new" className="btn btn-outline">Proponer</Link>}
            {user && <Link to="/me" className="btn btn-outline">Mi perfil</Link>}
            {user?.role==='admin' && <Link to="/admin/places" className="btn btn-outline">Admin</Link>}
            {!user ? (
              <>
                <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
                <Link to="/register" className="btn btn-outline">Registro</Link>
              </>
            ) : (
              <>
                <span className="badge">Hola, {user.name}</span>
                <button onClick={logout} className="btn btn-primary">Salir</button>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  )
}
