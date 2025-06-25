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
    fetch("http://localhost:8000/api/dashboard-alumno/", {
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
        {notas.notas.map((curso, i) => (
          <li key={i} className="list-group-item">
            <strong>{curso.curso}</strong>: {curso.notas.join(", ")} —{" "}
            <span className="fw-semibold">Promedio:</span> {curso.promedio}
          </li>
        ))}
      </ul>
    </div>
  );
}
