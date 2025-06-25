import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPadre() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard-padre/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-center mt-4">Cargando...</p>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard del Padre</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Salir
        </button>
      </div>

      {data.hijos.map((hijo, i) => (
        <div key={i} className="mb-4">
          <h4 className="text-primary">{hijo.alumno}</h4>
          <ul className="list-group mb-3">
            {hijo.notas.map((n, j) => (
              <li key={j} className="list-group-item">
                {n.curso}: {n.notas.join(", ")} —{" "}
                <span className="fw-semibold">Promedio:</span> {n.promedio}
              </li>
            ))}
          </ul>
          <hr />
        </div>
      ))}
    </div>
  );
}
