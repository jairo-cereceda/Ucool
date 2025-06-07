import React, { useState, useEffect, useCallback } from "react";
import Breadcumb from "../../components/navigation/breadcumb";
import Header from "../../components/header/headerDashboard";
import ListaBasica from "../../components/lists/listaBasica";
import PanelFormulario from "../../components/forms/edicionProducto";

export default function PanelAdministrarProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorForm, setProveedorForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    cif: "",
  });

  const cargarProveedores = useCallback(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;

    fetch(`${backendURL}/proveedores`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProveedores(data);
        setProveedorForm({
          nombre: "",
          telefono: "",
          email: "",
          direccion: "",
          cif: "",
        });
      })
      .catch((error) => console.error("Error al obtener compras:", error));
  }, []);

  useEffect(() => {
    cargarProveedores();
  }, [cargarProveedores]);

  const form = [
    {
      type: "text",
      title: "Nombre",
      id: "nombre",
      required: true,
      value: proveedorForm.nombre,
    },
    {
      type: "text",
      title: "Teléfono",
      id: "telefono",
      value: proveedorForm.telefono,
    },
    {
      type: "email",
      title: "Email",
      id: "email",
      value: proveedorForm.email,
    },
    {
      type: "text",
      title: "Dirección",
      id: "direccion",
      value: proveedorForm.direccion,
    },
    {
      type: "text",
      title: "CIF",
      id: "cif",
      value: proveedorForm.cif,
    },
  ];

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "/administrar-pagos", name: "Pagos" },
    {
      link: `/administrar-proveedores`,
      name: "Administrar proveedores",
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="panelAdministrar grid grid-cols-3 gap-5 h-full">
        <div className="col-span-1 panelAdministrar__listado">
          <ListaBasica
            objetos={proveedores}
            onSuccess={cargarProveedores}
            url={"administrar-proveedores"}
            coleccion={"proveedores"}
          />
        </div>
        <div className="col-span-2 panelAdministrar__form">
          <div className="mb-3">
            <h1 className="text-[4.8rem] font-bold">Proveedores</h1>
            <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
          </div>
          <PanelFormulario
            form={form}
            objeto={proveedorForm}
            onChange={(key, value) =>
              setProveedorForm((prevForm) => ({
                ...prevForm,
                [key]: value,
              }))
            }
            operacion="POST"
            coleccion="proveedores"
            onSuccess={cargarProveedores}
          />
        </div>
      </div>
    </div>
  );
}
