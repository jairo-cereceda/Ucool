import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PanelLogin() {
  const { login } = useAuth();

  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUsuario((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const backendURL = import.meta.env.VITE_API_HOST;
      const res = await fetch(`${backendURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });

      const data = await res.json();

      if (res.status === 403 && data.needsVerification === true) {
        navigate("/espera-verificar", {
          state: { desdeRegisterOrLogin: true },
        });
        return;
      }

      if (!res.ok) {
        toast.error("El usuario o la contraseña no son correctos");
        throw new Error(data.mensaje || "Error al iniciar sesión");
      }

      login(data.token);

      navigate("/");
    } catch (error) {
      toast.error("Ocurrió un error");
      error;
    }
  };

  return (
    <div className="flex items-center h-screen">
      <div className="login">
        <div className="flex login__container justify-center">
          <img
            src="/resources/store1.png"
            alt=""
            className="flex login__container__img"
          />
          <div className="login__container__main">
            <h1 className="login__container__main__titulo">Iniciar Sesión</h1>
            <form
              onSubmit={handleSubmit}
              className="login__container__main__formulario flex flex-col gap-4"
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                id="email"
                className="login__container__main__formulario__input"
                required
              />
              <br />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                id="password"
                className="login__container__main__formulario__input"
                required
              />
              <Link
                to="/enviar-cambiar-pass"
                className="login__container__main__formulario__forget"
              >
                He olvidado mi contraseña
              </Link>
              <br />
              <div className="login__container__main__formulario__botones flex gap-6 justify-between">
                <button
                  type="submit"
                  className="login__container__main__formulario__botones__iniciar"
                >
                  Iniciar Sesión
                </button>
                <Link
                  to="#"
                  className="login__container__main__formulario__botones__google flex items-center"
                >
                  <img
                    src="/google.png"
                    alt=""
                    className="login__container__main__formulario__botones__google__icon"
                  />
                </Link>
              </div>
              <div className="flex gap-2 login__container__main__formulario__otro">
                <p>¿No tienes cuenta?</p>
                <Link to="/register"> Registrate</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
