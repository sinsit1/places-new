export const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function http(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    ...options,
    headers
  });

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { error: res.statusText };
    }
    throw err;
  }

  // si la respuesta es 204 (sin contenido)
  if (res.status === 204) return null;

  return res.json();
}
