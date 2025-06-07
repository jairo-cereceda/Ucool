import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Header from "../../components/header/headerDashboard";
import Breadcumb from "../../components/navigation/breadcumb";
import ListaBasica from "../../components/lists/listaBasica";
import SubmitComponent from "../../components/forms/components/submit";

export default function PanelAdministrarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioForm, setUsuarioForm] = useState({
    nombre: "",
    telefono: "",
    nif: "",
    email: "",
    password: "",
    passwordConfirm: "",
    rol: "empleado",
  });

  const onChange = (key, value) => {
    setUsuarioForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const cargarUsuarios = useCallback(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;

    fetch(`${backendURL}/usuarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
        setUsuarioForm({
          nombre: "",
          telefono: "",
          nif: "",
          email: "",
          password: "",
          passwordConfirm: "",
          rol: "empleado",
        });
      })
      .catch((error) => console.error("Error al obtener compras:", error));
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  if (!usuarios) return <p>Cargando...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      usuarioForm.email === "" ||
      usuarioForm.dni === "" ||
      usuarioForm.email === "" ||
      usuarioForm.password === "" ||
      usuarioForm.passwordConfirm === "" ||
      usuarioForm.rol === ""
    ) {
      toast.error("Por favor, complete todos los campos obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usuarioForm.email)) {
      toast.error("Usa un email válido");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(usuarioForm.password)) {
      toast.error(
        "La contraseña debe tener al menos 8 caracteres y contener letras y números"
      );
      return;
    }

    if (usuarioForm.password === usuarioForm.passwordConfirm) {
      usuarioForm.establecimiento_id = usuarios[0].establecimiento_id;
      try {
        const token = localStorage.getItem("token");
        const backendURL = import.meta.env.VITE_API_HOST;
        const response = await fetch(`${backendURL}/auth/register`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioForm),
        });

        const data = await response.json();

        if (data.mensaje === "El correo electrónico ya está registrado.") {
          toast.error(
            "Email de usuario ya registrado, por favor inténtelo con otro"
          );
          return;
        }

        if (!response.ok) {
          toast.error("El formulario contiene algún error");
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.mensaje || `Error HTTP ${response.status}`);
        } else {
          toast.success("Usuario guardado con éxito");
        }

        cargarUsuarios();
      } catch (err) {
        console.error("Error al crear la venta:", err);
      }
    } else {
      if (usuarioForm.password !== usuarioForm.passwordConfirm) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
    }
  };

  const form = [
    {
      type: "text",
      title: "Nombre Completo",
      id: "nombre",
      required: true,
      value: usuarioForm.nombre,
    },
    {
      type: "text",
      title: "Teléfono",
      id: "telefono",
      value: usuarioForm.telefono,
    },
    {
      type: "text",
      title: "DNI",
      id: "nif",
      required: true,
      value: usuarioForm.nif,
    },
    {
      type: "email",
      title: "Correo electrónico",
      id: "email",
      required: true,
      value: usuarioForm.email,
    },
    {
      type: "password",
      title: "Contraseña",
      id: "password",
      required: true,
      value: usuarioForm.password,
    },
    {
      type: "password",
      title: "Confirmar contraseña",
      id: "passwordConfirm",
      required: true,
      value: usuarioForm.passwordConfirm,
    },
    {
      type: "select",
      title: "Rol",
      id: "rol",
      value: usuarioForm.rol,
      required: true,
      options: [
        { text: "Empleado", value: "empleado" },
        { text: "Administrador", value: "administrador" },
      ],
    },
  ];

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "", name: "Administrar usuarios" },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="panelAdministrar grid grid-cols-3 gap-5 h-full">
        <div className="col-span-1 panelAdministrar__listado">
          <ListaBasica
            objetos={usuarios}
            url={"administrar-usuarios"}
            coleccion={"usuarios"}
            onSuccess={cargarUsuarios}
          />
        </div>
        <div className="col-span-2 panelAdministrar__form">
          <div className="mb-4">
            <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
              Editar compra
            </h1>
            <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
          </div>
          <form className="formEditarProducto" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              {form.map((data, i) => (
                <div
                  key={i}
                  className="flex gap-1 formEditarProducto__container"
                >
                  <label
                    htmlFor={data.id}
                    className="formEditarProducto__container__label"
                  >
                    {data.title}
                  </label>
                  {data.type === "text" ||
                  data.type === "date" ||
                  data.type === "email" ||
                  data.type === "password" ? (
                    <input
                      type={data.type}
                      id={data.id}
                      name={data.id}
                      value={data.value}
                      onChange={(e) => onChange(data.id, e.target.value)}
                      className="formEditarProducto__container__input"
                      {...(data.required ? { required: true } : {})}
                    ></input>
                  ) : (
                    <select
                      id={data.id}
                      name={data.id}
                      value={data.value}
                      className="formEditarProducto__container__input"
                      onChange={(e) => onChange(data.id, e.target.value)}
                      {...(data.required ? { required: true } : {})}
                    >
                      {data.options.map((option, j) => (
                        <option key={j} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
            <SubmitComponent />
          </form>
        </div>
      </div>
    </div>
  );
}
