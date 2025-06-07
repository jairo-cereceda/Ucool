import React from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function EsperaVerificar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!location.state?.desdeRegisterOrLogin) {
      navigate("/");
      return;
    }
  }, [location, navigate]);

  const email = user?.email;

  const handleButton = async (e) => {
    e.preventDefault();

    try {
      if (!email) {
        navigate("/login");
        return;
      }

      const backendURL = import.meta.env.VITE_API_HOST;
      const res = await fetch(`${backendURL}/auth/resend-verification-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || "Error al iniciar sesión");
    } catch (error) {
      toast.error("Ocurrió un error");
      error;
    }
  };
  return (
    <div className="h-screen flex flex-col items-center justify-center esperaVerificar">
      <div className="esperaVerificar__container">
        <h1 className="esperaVerificar__container__title">
          Verifica tu cuenta
        </h1>
        <p className="esperaVerificar__container__info">
          Te hemos enviado un mail de verificación para tu cuenta. Por favor,
          sigue las instrucciones.
        </p>
        <br />
        <p className="esperaVerificar__container__info">
          En caso de no encontrarlo, por favor, revisa el apartado SPAM.
        </p>
        <button className="bg-amber-200 p-4 text-black" onClick={handleButton}>
          Reenviar Correo
        </button>
      </div>
    </div>
  );
}
