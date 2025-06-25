import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardProfesor from "./pages/DashboardProfesor";
import DashboardAlumno from "./pages/DashboardAlumno";
import DashboardPadre from "./pages/DashboardPadre";

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  return token && userRole === role ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/profesor"
          element={
            <PrivateRoute role="profesor">
              <DashboardProfesor />
            </PrivateRoute>
          }
        />
        <Route
          path="/alumno"
          element={
            <PrivateRoute role="alumno">
              <DashboardAlumno />
            </PrivateRoute>
          }
        />
        <Route
          path="/padre"
          element={
            <PrivateRoute role="padre">
              <DashboardPadre />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
