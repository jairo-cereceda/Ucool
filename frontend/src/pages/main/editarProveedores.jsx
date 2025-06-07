import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/header/headerDashboard";
import Breadcumb from "../../components/navigation/breadcumb";
import TablaDefault from "../../components/tables/tableDefault";
import MenuAdministrar from "../../components/main/tools/menuAdministrar";
import PanelFormulario from "../../components/forms/edicionProducto";
import { MdOutlineEdit } from "react-icons/md";

export default function PanelEditarProveedores() {
  const activeItem = "Edicion";
  const [proveedor, setProveedor] = useState([]);
  const [proveedorForm, setProveedorForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    cif: "",
  });

  const { id } = useParams();

  const token = localStorage.getItem("token");
  const backendURL = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    fetch(`${backendURL}/proveedores/${id}`, {
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
        setProveedor(data);
        setProveedorForm(data);
      })
      .catch((error) => console.error("Error al obtener compra:", error));
  }, [id, backendURL, token]);

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "/administrar-pagos", name: "Pagos" },
    {
      link: `/administrar-proveedores`,
      name: "Administrar proveedores",
    },
    {
      link: "",
      name: "Editar proveedor",
    },
  ];

  if (!proveedor) return <p>Cargando categoria...</p>;

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

  const panels = {
    Edicion: (
      <PanelFormulario
        form={form}
        img={null}
        objeto={proveedorForm}
        hasInputFile={false}
        objetoId={proveedor._id}
        operacion="PUT"
        onChange={(key, value) =>
          setProveedorForm((prev) => ({ ...prev, [key]: value }))
        }
        coleccion="proveedores"
      />
    ),
  };
  return (
    <div className="h-screen flex flex-col vista-producto">
      <Header />
      <div className="flex-grow flex vista-producto__container">
        <div className="flex-grow vista-producto__container__body">
          <div className="flex justify-between vista-producto__container__body__nav editar-mobile-flex">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
                Editar proveedor
              </h1>
              <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
            </div>
            <MenuAdministrar
              content={null}
              activeItem={activeItem}
              elementoId={proveedor._id}
              coleccion="proveedores"
            />
          </div>
          <div className="vista-producto__container__body__item">
            {panels[activeItem]}
          </div>
        </div>
      </div>
    </div>
  );
}
