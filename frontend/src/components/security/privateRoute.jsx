import { useNavigate, Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export const PrivateRouteVerified = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [autorizado, setAutorizado] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAutorizado(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (!decoded.isVerified) {
        navigate("/espera-verificar", {
          state: { desdeRegisterOrLogin: true },
        });
        return;
      }

      if (!decoded.isSubscribed) {
        navigate("/suscripcion");
        return;
      }

      setAutorizado(true);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return <Navigate to="/login" />;
    }
  }, [navigate]);

  if (autorizado === null) {
    return <div>Cargando...</div>;
  }

  if (!autorizado) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
};
