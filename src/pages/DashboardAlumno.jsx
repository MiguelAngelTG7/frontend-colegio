import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardAlumno() {
  const [notas, setNotas] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard-alumno/`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then(setNotas);
  }, []);

  if (!notas) return <p className="text-center mt-4">Cargando...</p>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Hola, {notas.alumno}</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Salir
        </button>
      </div>

      <h4 className="mb-3">Tus cursos y notas:</h4>
      <ul className="list-group">
        {notas.notas.map((curso, i) => {
          const promedio = Number(curso.promedio);
          const estado = promedio >= 10.5 ? "Aprobado" : "Desaprobado";
          const color = promedio >= 10.5 ? "text-success" : "text-danger";

          return (
            <li key={i} className="list-group-item">
              <strong>{curso.curso}</strong>: {curso.notas.join(", ")} —{" "}
              <span className="fw-semibold">Promedio:</span> {promedio}{" "}
              <span className={`ms-2 fw-bold ${color}`}>{estado}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
