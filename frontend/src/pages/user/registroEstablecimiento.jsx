import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function RegistroEstablecimiento() {
  const [establecimiento, setEstablecimiento] = useState({
    nombre: "",
    direccion: "",
    email: "",
    telefono: "",
    cif: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEstablecimiento((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuario = JSON.parse(localStorage.getItem("usuarioRegistro"));

    if (!usuario) {
      navigate("/register");
      return;
    }

    if (establecimiento.nombre === "" || usuario.email === "") {
      toast.error("Por favor, complete todos los campos obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(establecimiento.email)) {
      toast.error("Usa un email válido");
      return;
    }

    try {
      const backendURL = import.meta.env.VITE_API_HOST;
      const res = await fetch(`${backendURL}/auth/register-establecimiento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, establecimiento }),
      });

      const data = await res.json();

      if (data.mensaje === "El correo electrónico ya está registrado.") {
        toast.error(
          "Email de usuario ya registrado, por favor inténtelo con otro"
        );
        return;
      }

      if (data.mensaje === "Ya existe un establecimiento con ese email.") {
        toast.error(
          "Email de establecimiento ya registrado, por favor inténtelo con otro"
        );
        return;
      }

      if (!res.ok) {
        toast.error(
          "Algo en el registro no salió bien. Por favor, inténtelo de nuevo"
        );
        throw new Error(data.mensaje || "Error al registrar");
      } else {
        localStorage.removeItem("usuarioRegistro");
        navigate("/espera-verificar", {
          state: { desdeRegisterOrLogin: true },
        });
      }
    } catch (error) {
      toast.error("Ocurrió un error");
      error;
    }
  };

  return (
    <div className="flex items-center h-screen">
      <div className="registroEst">
        <div className="flex registroEst__container justify-center">
          <div className="registroEst__container__main login__container__main--registro">
            <h1 className="registroEst__container__main__titulo">
              Registra tu establecimiento
            </h1>
            <form
              onSubmit={handleSubmit}
              className="registroEst__container__main__formulario flex flex-col gap-4"
            >
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                onChange={handleChange}
                id="nombre"
                className="registroEst__container__main__formulario__input"
                required
              />
              <br />
              <input
                type="text"
                name="direccion"
                placeholder="Direccion"
                onChange={handleChange}
                id="direccion"
                className="registroEst__container__main__formulario__input"
              />
              <br />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                id="email"
                className="registroEst__container__main__formulario__input"
                required
              />
              <br />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                onChange={handleChange}
                id="telefono"
                className="registroEst__container__main__formulario__input"
              />
              <br />
              <input
                type="text"
                name="cif"
                placeholder="CIF"
                onChange={handleChange}
                id="cif"
                className="registroEst__container__main__formulario__input"
              />
              <div className="registroEst__container__main__formulario__botones flex gap-6 justify-between">
                <button
                  type="submit"
                  className="registroEst__container__main__formulario__botones__registrar"
                >
                  Registrar Establecimiento
                </button>
              </div>
              <div className="flex gap-2 registroEst__container__main__formulario__otro">
                <p>¿Ya tienes cuenta?</p>
                <Link to="/login">Inicia Sesión</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
