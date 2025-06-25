import { useEffect, useState } from "react";

export default function DashboardProfesor() {
  const [data, setData] = useState(null);
  const [notasInput, setNotasInput] = useState({});
  const [mensajes, setMensajes] = useState({});
  const token = localStorage.getItem("token");

  // Función para obtener datos actualizados
  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (alumnoId, index, value) => {
    const nota = Number(value);

    if (isNaN(nota) || nota < 0 || nota > 20) {
      setMensajes((prev) => ({
        ...prev,
        [alumnoId]: `La nota ${index + 1} debe estar entre 0 y 20.`,
      }));
      return;
    }

    setMensajes((prev) => ({
      ...prev,
      [alumnoId]: "",
    }));

    setNotasInput((prev) => ({
      ...prev,
      [alumnoId]: {
        ...(prev[alumnoId] || {}),
        [index]: nota,
      },
    }));
  };

  const enviarNotas = async (alumnoId, cursoId, notasPrevias) => {
    const notasArray = [0, 1, 2, 3].map((i) =>
      notasInput[alumnoId]?.[i] !== undefined
        ? Number(notasInput[alumnoId][i])
        : notasPrevias[i]
    );

    if (notasArray.some((nota) => isNaN(nota) || nota < 0 || nota > 20)) {
      setMensajes((prev) => ({
        ...prev,
        [alumnoId]: "Todas las notas deben ser números entre 0 y 20.",
      }));
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrar-nota/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          alumno_id: alumnoId,
          curso_id: cursoId,
          notas: notasArray,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        // Limpiar campos
        setNotasInput((prev) => {
          const copy = { ...prev };
          delete copy[alumnoId];
          return copy;
        });

        // ✅ Volver a cargar datos del backend
        await fetchData();
      }

      setMensajes((prev) => ({
        ...prev,
        [alumnoId]: result.mensaje || result.error || "Error desconocido",
      }));
    } catch (err) {
      setMensajes((prev) => ({
        ...prev,
        [alumnoId]: "Error al conectar con el servidor",
      }));
    }
  };

  if (!data) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard del Profesor</h2>
        <button
          className="btn btn-outline-danger"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {data.cursos.map((curso, i) => (
        <div key={i} className="mb-4">
          <h4 className="text-primary">Curso: {curso.curso}</h4>
          {Object.entries(curso.grados).map(([grado, secciones], j) => (
            <div key={j} className="mb-3">
              <h5 className="text-secondary">Grado: {grado}</h5>
              {secciones.map((s, k) => (
                <div key={k} className="mb-2 border p-3 rounded shadow-sm bg-light">
                  <p className="fw-bold mb-2">Sección {s.seccion}:</p>
                  <ul className="list-group">
                    {s.alumnos.map((alumno, l) => {
                      const alumnoId = s.alumno_ids[l];
                      const notasPrevias = s.notas_previas?.[l] || [0, 0, 0, 0];

                      const notasActuales = [0, 1, 2, 3].map((i) =>
                        notasInput[alumnoId]?.[i] !== undefined
                          ? Number(notasInput[alumnoId][i])
                          : Number(notasPrevias[i])
                      );

                      const promedio =
                        notasActuales.reduce((sum, nota) => sum + nota, 0) /
                        notasActuales.length;

                      const estado = promedio >= 10.5 ? "Aprobado" : "Desaprobado";
                      const colorEstado =
                        promedio >= 10.5 ? "text-success" : "text-danger";

                      return (
                        <li
                          key={l}
                          className="list-group-item d-flex flex-column align-items-start"
                        >
                          <strong className="mb-2">{alumno}</strong>
                          <div className="d-flex flex-wrap gap-2 align-items-center">
                            {[0, 1, 2, 3].map((n) => {
                              const valorActual =
                                notasInput[alumnoId]?.[n] !== undefined
                                  ? notasInput[alumnoId][n]
                                  : notasPrevias[n];
                              return (
                                <input
                                  key={n}
                                  type="number"
                                  min="0"
                                  max="20"
                                  className={`form-control ${
                                    valorActual < 0 || valorActual > 20
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  style={{ width: "80px" }}
                                  placeholder={`Nota ${n + 1}`}
                                  value={valorActual}
                                  onChange={(e) =>
                                    handleChange(alumnoId, n, e.target.value)
                                  }
                                />
                              );
                            })}
                            <button
                              className="btn btn-sm btn-success ms-2"
                              onClick={() =>
                                enviarNotas(alumnoId, curso.curso_id, notasPrevias)
                              }
                            >
                              Registrar
                            </button>
                          </div>

                          {/* Mensaje */}
                          {mensajes[alumnoId] && (
                            <div
                              className={`mt-2 ${
                                mensajes[alumnoId].includes("Error") ||
                                mensajes[alumnoId].includes("debe estar")
                                  ? "text-danger"
                                  : "text-success"
                              }`}
                              style={{ fontSize: "0.9em" }}
                            >
                              {mensajes[alumnoId]}
                            </div>
                          )}

                          {/* Promedio */}
                          <p className="mt-2" style={{ fontSize: "0.9em" }}>
                            Promedio: {promedio.toFixed(2)}{" "}
                            <span className={`ms-2 fw-bold ${colorEstado}`}>
                              {estado}
                            </span>
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
