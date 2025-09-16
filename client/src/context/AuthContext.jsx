import React, { createContext, useContext, useEffect, useState } from 'react'
import { http, API } from '../api/http.js'

const Ctx = createContext(null)
export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ (async()=>{
    try{
      const { user } = await http('/auth/me')
      setUser(user)
    }catch{}
    setLoading(false)
  })() },[])

  const login = async (email, password) => {
    const { user } = await http('/auth/login',{ method:'POST', body: JSON.stringify({ email, password }) })
    setUser(user)
  }
  const register = async (name, email, password) => {
    const { user } = await http('/auth/register',{ method:'POST', body: JSON.stringify({ name, email, password }) })
    setUser(user)
  }
  const logout = async () => {
    await fetch(`${API}/auth/logout`, { method:'POST', credentials:'include' })
    setUser(null)
  }

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>
}
export const useAuth = ()=> useContext(Ctx)
