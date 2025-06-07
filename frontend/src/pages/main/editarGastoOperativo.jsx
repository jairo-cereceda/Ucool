import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/header/headerDashboard";
import Breadcumb from "../../components/navigation/breadcumb";
import TablaDefault from "../../components/tables/tableDefault";
import MenuAdministrar from "../../components/main/tools/menuAdministrar";
import PanelFormulario from "../../components/forms/edicionProducto";
import { MdOutlineEdit } from "react-icons/md";

export default function PanelEditarGastoOperativo() {
  const activeItem = "Edicion";
  const [gasto, setGasto] = useState([]);
  const [gastoForm, setGastoForm] = useState({
    descripcion_gasto: "",
    categoria_gasto: "",
    monto_gasto: "",
    fecha_gasto: "",
    observaciones: "",
  });

  const { id } = useParams();

  const token = localStorage.getItem("token");
  const backendURL = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    fetch(`${backendURL}/gastosOperativos/${id}`, {
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
        setGasto(data);
        const montoGasto = data.monto_gasto.$numberDecimal;

        const fecha = data.fecha_gasto
          ? new Date(data.fecha_gasto).toISOString().split("T")[0]
          : "";

        setGastoForm({
          ...data,
          monto_gasto: parseFloat(montoGasto),
          fecha_gasto: fecha,
        });
      })
      .catch((error) => console.error("Error al obtener compra:", error));
  }, [id, backendURL, token]);

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "/administrar-pagos", name: "Pagos" },
    {
      link: `/administrar-gastos-operativos`,
      name: "Administrar gastos operativos",
    },
    {
      link: "",
      name: "Editar gastos operativos",
    },
  ];

  if (!gasto) return <p>Cargando categoria...</p>;

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

  const panels = {
    Edicion: (
      <PanelFormulario
        form={form}
        img={null}
        objeto={gastoForm}
        hasInputFile={false}
        objetoId={gasto._id}
        operacion="PUT"
        onChange={(key, value) =>
          setGastoForm((prev) => ({ ...prev, [key]: value }))
        }
        coleccion="gastosOperativos"
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
                Editar gasto operativo
              </h1>
              <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
            </div>
            <MenuAdministrar
              content={null}
              activeItem={activeItem}
              elementoId={gasto._id}
              coleccion="gastosOperativos"
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
