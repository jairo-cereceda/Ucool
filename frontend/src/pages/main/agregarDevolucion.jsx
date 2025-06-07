import React, { useState } from "react";
import Header from "../../components/header/headerDashboard";
import Breadcumb from "../../components/navigation/breadcumb";
import PanelFormulario from "../../components/forms/edicionProducto";

export default function AgregarDevolucion() {
  const [devolucionForm, setDevolucionForm] = useState({
    venta_id: "",
    total_devuelto: "",
    metodo_reembolso: "tarjeta",
    observaciones: "",
  });

  const form = [
    {
      type: "text",
      title: "ID de la venta",
      id: "venta_id",
      required: true,
      value: devolucionForm.venta_id,
    },
    {
      type: "text",
      title: "Cantidad a Devolver",
      id: "total_devuelto",
      required: true,
      value: devolucionForm.total_devuelto,
    },
    {
      type: "select",
      title: "Método de reembolso",
      id: "metodo_reembolso",
      required: true,
      value: devolucionForm.metodo_reembolso,
      options: [
        { text: "Tarjeta", value: "tarjeta" },
        { text: "Efectivo", value: "efectivo" },
        { text: "Cupón", value: "cupon" },
      ],
    },
    {
      type: "text",
      title: "Observaciones",
      id: "observaciones",
      value: devolucionForm.observaciones,
    },
  ];

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "/administrar-ventas", name: "Administrar Ventas" },
    {
      link: "/administrar-devoluciones",
      name: "Administrar devoluciones",
    },
    {
      link: "",
      name: "Agregar devolución",
    },
  ];

  return (
    <div className="flex gap-2 flex-col h-screen">
      <Header />
      <div className="panelAdministrar grid grid-cols-3 gap-5 h-full">
        <div className="col-span-3 panelAdministrar__form">
          <div className="mb-4">
            <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
              Agregar devolución
            </h1>
            <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
          </div>
          <PanelFormulario
            form={form}
            objeto={devolucionForm}
            onChange={(key, value) =>
              setDevolucionForm((prevForm) => ({
                ...prevForm,
                [key]: value,
              }))
            }
            operacion="POST"
            coleccion="devoluciones"
            useNavigateURL="/administrar-devoluciones"
          />
        </div>
      </div>
    </div>
  );
}
