import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/header/headerDashboard";
import ListaBasica from "../../components/lists/listaBasica";
import Breadcumb from "../../components/navigation/breadcumb";
import PanelFormulario from "../../components/forms/edicionProducto";

export default function PanelAdministrarGastosOperativos() {
  const [gastos, setGastos] = useState([]);
  const [gastoForm, setGastoForm] = useState({
    descripcion_gasto: "",
    categoria_gasto: "",
    monto_gasto: "",
    fecha_gasto: "",
    observaciones: "",
  });

  const cargarGastos = useCallback(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;

    fetch(`${backendURL}/gastosOperativos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGastos(data);
        setGastoForm({
          descripcion_gasto: "",
          categoria_gasto: "",
          monto_gasto: "",
          fecha_gasto: "",
          observaciones: "",
        });
      })
      .catch((error) => console.error("Error al obtener compras:", error));
  }, []);

  useEffect(() => {
    cargarGastos();
  }, [cargarGastos]);

  const form = [
    {
      type: "text",
      title: "Descripción",
      id: "descripcion_gasto",
      required: true,
      value: gastoForm.descripcion_gasto,
    },
    {
      type: "text",
      title: "Categoría",
      id: "categoria_gasto",
      value: gastoForm.categoria_gasto,
    },
    {
      type: "number",
      title: "Monto",
      id: "monto_gasto",
      required: true,
      value: gastoForm.monto_gasto,
    },
    {
      type: "date",
      title: "Fecha del gasto",
      id: "fecha_gasto",
      required: true,
      value: gastoForm.fecha_gasto,
    },
    {
      type: "text",
      title: "Observaciones",
      id: "observaciones",
      value: gastoForm.observaciones,
    },
  ];

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "/administrar-pagos", name: "Pagos" },
    {
      link: `/administrar-gastos-operativos`,
      name: "Administrar gastos operativos",
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="panelAdministrar grid grid-cols-3 gap-5 h-full">
        <div className="col-span-1 panelAdministrar__listado">
          <ListaBasica
            objetos={gastos}
            url={"administrar-gastos-operativos"}
            coleccion={"gastosOperativos"}
            onSuccess={cargarGastos}
          />
        </div>
        <div className="col-span-2 panelAdministrar__form">
          <div className="mb-3">
            <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">Gastos</h1>
            <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
          </div>
          <PanelFormulario
            form={form}
            objeto={gastoForm}
            onChange={(key, value) =>
              setGastoForm((prevForm) => ({
                ...prevForm,
                [key]: value,
              }))
            }
            operacion="POST"
            coleccion="gastosOperativos"
            onSuccess={cargarGastos}
          />
        </div>
      </div>
    </div>
  );
}
