import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function Registro() {
  const [usuario, setUsuario] = useState({
    nombre: "",
    telefono: "",
    nif: "",
    email: "",
    password: "",
    password_confirm: "",
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

    if (
      usuario.nombre === "" ||
      usuario.email === "" ||
      usuario.nif === "" ||
      usuario.password === "" ||
      usuario.password_confirm === ""
    ) {
      toast.error("Por favor, complete todos los campos obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usuario.email)) {
      toast.error("Por favor, use un email válido");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(usuario.password)) {
      toast.error(
        "La contraseña debe tener al menos 8 caracteres y contener letras y números"
      );
      return;
    }

    if (usuario.password !== usuario.password_confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const usuarioConRol = { ...usuario, rol: "administrador" };

    const { password_confirm, ...usuarioSinConfirm } = usuarioConRol;
    password_confirm;
    localStorage.setItem("usuarioRegistro", JSON.stringify(usuarioSinConfirm));
    navigate("/register-establecimiento");
  };

  return (
    <div className="flex items-center h-screen">
      <div className="register">
        <div className="flex register__container justify-center">
          <img
            src="/resources/store1.png"
            alt=""
            className="flex register__container__img"
          />
          <div className="register__container__main register__container__main--registro">
            <h1 className="register__container__main__titulo">Registrarme</h1>
            <form
              onSubmit={handleSubmit}
              className="register__container__main__formulario flex flex-col gap-4"
            >
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                onChange={handleChange}
                id="nombre"
                className="register__container__main__formulario__input"
                required
              />
              <br />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                id="email"
                className="register__container__main__formulario__input"
                required
              />
              <br />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                onChange={handleChange}
                id="telefono"
                className="register__container__main__formulario__input"
              />
              <br />
              <input
                type="text"
                name="nif"
                placeholder="NIF"
                onChange={handleChange}
                id="nif"
                className="register__container__main__formulario__input"
                required
              />
              <br />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                id="password"
                className="register__container__main__formulario__input"
                required
              />
              <br />
              <input
                type="password"
                name="password_confirm"
                placeholder="Confirmar contraseña"
                onChange={handleChange}
                id="password_confirm"
                className="register__container__main__formulario__input"
                required
              />
              <br />
              <div className="register__container__main__formulario__botones flex gap-6 justify-between">
                <button
                  type="submit"
                  className="register__container__main__formulario__botones__iniciar"
                >
                  Registrar
                </button>
                <Link
                  to="#"
                  className="register__container__main__formulario__botones__google flex items-center"
                >
                  <img
                    src="/google.png"
                    alt=""
                    className="register__container__main__formulario__botones__google__icon"
                  />
                </Link>
              </div>
              <div className="flex gap-2 register__container__main__formulario__otro">
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
