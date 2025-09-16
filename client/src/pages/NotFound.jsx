import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
      <p className="text-gray-600 mb-6">
        El recurso que estás buscando no existe o fue eliminado.
      </p>
      <Link
        to="/"
        className="btn btn-primary"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
