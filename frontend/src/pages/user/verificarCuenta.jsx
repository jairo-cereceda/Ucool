import React from "react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function VerificarEmail() {
  const [estado, setEstado] = useState("Verificando...");
  const [searchParams] = useSearchParams();
  const yaVerificado = useRef(false);

  useEffect(() => {
    const verificar = async () => {
      if (yaVerificado.current) return;
      yaVerificado.current = true;

      const token = searchParams.get("token");
      if (!token) {
        return;
      }

      try {
        const backendURL = import.meta.env.VITE_API_HOST;
        const res = await fetch(`${backendURL}/auth/verify-email/${token}`);

        if (res.status === 200) {
          setEstado("200");
        } else if (res.status === 400) {
          setEstado("400");
        } else if (res.status === 500) {
          setEstado("500");
        }
      } catch (error) {
        setEstado("500");
        console.error(error);
      }
    };

    verificar();
  }, [searchParams]);

  if (estado == "200") {
    return (
      <div className="h-screen flex flex-col items-center justify-center esperaVerificar">
        <div className="esperaVerificar__container">
          <h1 className="esperaVerificar__container__title">
            ¡Cuenta Verificada con éxito!
          </h1>
          <p className="esperaVerificar__container__info">
            Ya puedes continuar con el proceso. Por favor pulsa Iniciar Sesión.
          </p>
          <br />
          <Link to="/login" className="bg-amber-200 p-4 text-black">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  } else if (estado == "400") {
    return (
      <div className="h-screen flex flex-col items-center justify-center esperaVerificar">
        <div className="esperaVerificar__container">
          <h1 className="esperaVerificar__container__title">
            La cuenta no fue verificada
          </h1>
          <p className="esperaVerificar__container__info">
            El código usado no era el correcto.
          </p>
          <br />
          <Link to="/login" className="bg-amber-200 p-4 text-black">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  } else if (estado == "500") {
    return (
      <div className="h-screen flex flex-col items-center justify-center esperaVerificar">
        <div className="esperaVerificar__container">
          <h1 className="esperaVerificar__container__title">
            La cuenta no fue verificada
          </h1>
          <p className="esperaVerificar__container__info">
            Estamos teniendo problemas en el servidor, disculpa las molestias.
          </p>
          <br />
          <Link to="/login" className="bg-amber-200 p-4 text-black">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }
}
