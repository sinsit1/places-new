import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import PlacesList from './pages/PlacesList.jsx'
import PlaceDetail from './pages/PlaceDetail.jsx'
import NewPlace from './pages/NewPlace.jsx'
import Profile from './pages/Profile.jsx'
import AdminPlaces from './pages/AdminPlaces.jsx'
import NotFound from './pages/NotFound.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

function Protected({ children }){
  const { user, loading } = useAuth();
  if (loading) return <div className="container py-10"><p>Cargando...</p></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminOnly({ children }){
  const { user, loading } = useAuth();
  if (loading) return <div className="container py-10"><p>Cargando...</p></div>;
  return (user && user.role === 'admin') ? children : <Navigate to="/" replace />;
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<PlacesList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/places/:id" element={<Protected><PlaceDetail /></Protected>} />
            <Route path="/new" element={<Protected><NewPlace /></Protected>} />
            <Route path="/me" element={<Protected><Profile /></Protected>} />
            <Route path="/admin/places" element={<AdminOnly><AdminPlaces /></AdminOnly>} />
            <Route path="*" element={<NotFound />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  </AuthProvider>
)
