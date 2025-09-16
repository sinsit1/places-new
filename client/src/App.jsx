import React, { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'

export default function App() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div>
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur relative z-50">
        <nav className="container flex items-center justify-between py-3 relative">
          {/* Logo */}
          <Link to="/" className="text-lg font-semibold">
            Lugares & Opiniones
          </Link>

          {/* Botón hamburguesa (solo móvil) */}
          <button
            className="md:hidden p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* Menú principal */}
          <div
            className={`
              flex-col md:flex-row md:flex md:items-center gap-3
              ${menuOpen ? 'flex' : 'hidden'}
              md:static absolute top-full left-0 w-full md:w-auto
              bg-white dark:bg-neutral-950 md:bg-transparent
              shadow md:shadow-none p-4 md:p-0
              z-50
            `}
          >
            <Link to="/" onClick={() => setMenuOpen(false)} className="btn btn-outline w-full md:w-auto">Lugares</Link>
            {user && <Link to="/new" onClick={() => setMenuOpen(false)} className="btn btn-outline w-full md:w-auto">Proponer</Link>}
            {user && <Link to="/me" onClick={() => setMenuOpen(false)} className="btn btn-outline w-full md:w-auto">Mi perfil</Link>}
            {user?.role === 'admin' && (
              <Link to="/admin/places" onClick={() => setMenuOpen(false)} className="btn btn-outline w-full md:w-auto">Admin</Link>
            )}

            {!user ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full md:w-auto">Iniciar sesión</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-outline w-full md:w-auto">Registro</Link>
              </>
            ) : (
              <>
                <span className="badge w-full md:w-auto text-center">Hola, {user.name}</span>
                <button
                  onClick={() => { logout(); setMenuOpen(false) }}
                  className="btn btn-primary w-full md:w-auto"
                >
                  Salir
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="container py-6 relative z-0">
        <Outlet />
      </main>
    </div>
  )
}
