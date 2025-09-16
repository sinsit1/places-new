export const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function http(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const opts = {
    credentials: 'include',
    ...options,
    headers
  };

  // 🔹 Si el body es un objeto, lo convertimos en JSON
  if (opts.body && typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(`${API}${path}`, opts);

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { error: res.statusText };
    }
    throw err;
  }

  // 🔹 Si la respuesta es 204 (sin contenido), devolvemos null
  if (res.status === 204) return null;

  return res.json();
}
