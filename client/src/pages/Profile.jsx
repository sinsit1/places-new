import React, { useEffect, useState } from 'react'
import { http } from '../api/http.js'

export default function Profile(){
  const [favorites, setFavorites] = useState([])

  useEffect(()=>{ (async()=>{
    try{
      const r = await http('/users/me/favorites')
      setFavorites(r.data)
    }catch{}
  })() }, [])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Mi perfil</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map(p=> (
          <div key={p._id} className="card p-4">
            <h3 className="font-semibold">{p.title}</h3>
            <div className="text-sm mt-2">⭐ {Number(p.avgRating || 0).toFixed(1)}</div>
          </div>
        ))}
      </div>
      {!favorites.length && <p className="text-neutral-600 dark:text-neutral-400">Aún no tienes favoritos.</p>}
    </div>
  )
}
