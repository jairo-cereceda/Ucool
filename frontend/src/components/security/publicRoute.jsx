import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export const PublicRoute = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [autorizado, setAutorizado] = useState(null);

  useEffect(() => {
    if (!user) {
      setAutorizado(true);
      return;
    }

    if (!user.isVerified) {
      navigate("/espera-verificar", {
        state: { desdeRegisterOrLogin: true },
      });
    } else {
      setAutorizado(false);
    }
  }, [user, navigate]);

  if (autorizado === null) {
    return <div>Cargando...</div>;
  }

  if (autorizado === true) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};
