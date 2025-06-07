import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/headerDashboard";
import ListaBasica from "../../components/lists/listaBasica";
import Breadcumb from "../../components/navigation/breadcumb";
import TablaDefault from "../../components/tables/tableDefault";
import PanelDetalleVenta from "../../components/main/ventas/detalleVenta";
import { FaArrowLeft } from "react-icons/fa";

export default function PanelAdministrarDevoluciones() {
  const [devoluciones, setDevoluciones] = useState([]);
  const [devolucion, setDevolucion] = useState({
    venta_id: "",
    total_devuelto: "",
    metodo_reembolso: "",
    observaciones: "",
  });

  const cargarProveedores = useCallback(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;

    fetch(`${backendURL}/devoluciones`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDevoluciones(data);
      })
      .catch((error) => console.error("Error al obtener compras:", error));
  }, []);

  useEffect(() => {
    cargarProveedores();
  }, [cargarProveedores]);

  const tabla = [
    ["ID de la venta", devolucion.venta_id],
    ["Total devuelto", devolucion.total_devuelto.$numberDecimal],
    ["Método de reembolso", devolucion.metodo_reembolso],
    ["Observaciones", devolucion.observaciones],
  ];

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "/administrar-ventas", name: "Administrar Ventas" },
    {
      link: "",
      name: "Administrar devoluciones",
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="panelAdministrar grid grid-cols-3 gap-5 h-full">
        <div className="col-span-1 panelAdministrar__listado">
          <ListaBasica
            objetos={devoluciones}
            onSuccess={cargarProveedores}
            url={"administrar-devoluciones"}
            coleccion={"devoluciones"}
            onHandleClickElemento={setDevolucion}
          />
        </div>
        <div className="col-span-2 panelAdministrar__form">
          <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
            Devoluciones
          </h1>
          <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
          <div className=" flex justify-between items-center mt-4">
            <Link
              to="/administrar-ventas"
              className="flex gap-1 items-center bg-[#ff8f6c] rounded-4xl text-white text-[1.6rem] px-4 hover:bg-[#ff5722] transition-colors duration-300 cursor-pointer mb-3"
            >
              <FaArrowLeft /> Volver
            </Link>
            <Link
              to="/crear-devolucion"
              className="bg-[#ff8f6c] rounded-4xl text-white text-[1.2rem] py-[0.3rem] sm:text-[1.6rem] px-4 hover:bg-[#ff5722] transition-colors duration-300 cursor-pointer mb-3"
            >
              Crear devolución
            </Link>
          </div>
          <TablaDefault tabla={tabla} />
        </div>
      </div>
    </div>
  );
}
