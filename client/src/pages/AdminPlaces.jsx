import React, { useEffect, useState } from 'react'
import { http } from '../api/http.js'

export default function AdminPlaces(){
  const [data, setData] = useState([])
  const [edit, setEdit] = useState(null)

  async function load(){
    const r = await http('/admin/places/pending')
    setData(r.data)
  }
  useEffect(()=>{ load() },[])

  async function setStatus(id, status){
  await http(`/places/${id}/status`, { 
    method:'PATCH', 
    body: JSON.stringify({ status }) 
  })
  await load()
}

  async function saveEdit(){
    await http(`/places/${edit._id}`, {
      method: 'PATCH',
      body: JSON.stringify(edit)
    })
    setEdit(null)
    await load()
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Admin: Propuestas pendientes</h2>
      <div className="overflow-x-auto card">
        <table className="min-w-full text-sm">
          <thead className="border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="text-left p-3">Título</th>
              <th className="text-left p-3">Autor</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map(p=>(
              <tr key={p._id} className="border-b last:border-0 border-neutral-100 dark:border-neutral-800">
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.author}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={()=>setStatus(p._id,'approved')} className="btn btn-primary">Publicar</button>
                  <button onClick={()=>setStatus(p._id,'rejected')} className="btn btn-outline">Rechazar</button>
                  <button onClick={()=>setEdit(p)} className="btn btn-outline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="card p-6 w-full max-w-lg space-y-3">
            <h3 className="text-lg font-semibold mb-2">Editar lugar</h3>
            <input className="input" value={edit.title} onChange={e=>setEdit({...edit,title:e.target.value})}/>
            <textarea className="input h-28" value={edit.description||''} onChange={e=>setEdit({...edit,description:e.target.value})}/>
            <div className="grid grid-cols-2 gap-3">
              <input className="input" placeholder="Ciudad" value={edit?.location?.city||''}
                onChange={e=>setEdit({...edit,location:{...edit.location,city:e.target.value}})} />
              <input className="input" placeholder="País" value={edit?.location?.country||''}
                onChange={e=>setEdit({...edit,location:{...edit.location,country:e.target.value}})} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={()=>setEdit(null)} className="btn btn-outline">Cancelar</button>
              <button onClick={saveEdit} className="btn btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
