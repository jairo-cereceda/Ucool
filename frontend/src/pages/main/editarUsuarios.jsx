import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/header/headerDashboard";
import Breadcumb from "../../components/navigation/breadcumb";
import TablaDefault from "../../components/tables/tableDefault";
import MenuAdministrar from "../../components/main/tools/menuAdministrar";
import PanelFormulario from "../../components/forms/edicionProducto";
import { MdOutlineEdit } from "react-icons/md";
import SubmitComponent from "../../components/forms/components/submit";

export default function PanelEditarUsuarios() {
  const activeItem = "Edicion";
  const [usuario, setUsuario] = useState([]);
  const [usuarioForm, setUsuarioForm] = useState({
    nombre: "",
    telefono: "",
    nif: "",
    email: "",
    rol: "",
  });

  const { id } = useParams();

  const onChange = (key, value) => {
    setUsuarioForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const token = localStorage.getItem("token");
  const backendURL = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    fetch(`${backendURL}/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        setUsuario(data);
        setUsuarioForm({
          ...data,
        });
      })
      .catch((error) => console.error("Error al obtener compra:", error));
  }, [id, backendURL, token]);

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "/administrar-usuarios", name: "Administrar usuarios" },
    { link: "", name: `Editar ${usuario.nombre}` },
  ];

  if (!usuario) return <p>Cargando categoria...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      usuarioForm.email === "" ||
      usuarioForm.dni === "" ||
      usuarioForm.email === "" ||
      usuarioForm.password === "" ||
      usuarioForm.passwordConfirm ||
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

    try {
      const token = localStorage.getItem("token");
      const backendURL = import.meta.env.VITE_API_HOST;
      const response = await fetch(`${backendURL}/usuarios/${usuario._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioForm),
      });

      if (!response.ok) {
        toast.error("El formulario contiene algún error");
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || `Error HTTP ${response.status}`);
      } else {
        toast.success("Usuario guardado con éxito");
      }
      await response.json();
    } catch (err) {
      console.error("Error al crear la venta:", err);
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
      type: "select",
      title: "Rol",
      id: "rol",
      required: true,
      value: usuarioForm.rol,
      options: [
        { text: "Empleado", value: "empleado" },
        { text: "Administrador", value: "administrador" },
      ],
    },
  ];

  return (
    <div className="h-screen flex flex-col vista-producto">
      <Header />
      <div className="flex-grow flex vista-producto__container">
        <div className="flex-grow vista-producto__container__body">
          <div className="flex justify-between vista-producto__container__body__nav">
            <div>
              <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
                Editar usuario
              </h1>
              <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
            </div>
            <MenuAdministrar
              content={null}
              activeItem={activeItem}
              elementoId={usuario._id}
              coleccion="usuarios"
            />
          </div>
          <div className="vista-producto__container__body__item">
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
                        {...(data.required ? { required: true } : {})}
                        className="formEditarProducto__container__input"
                      ></input>
                    ) : (
                      <select
                        name={data.id}
                        id={data.id}
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
    </div>
  );
}
