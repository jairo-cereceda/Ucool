import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/headerDashboard";
import Breadcumb from "../../components/navigation/breadcumb";
import ListaBasica from "../../components/lists/listaBasica";
import PanelDetalleVenta from "../../components/main/ventas/detalleVenta";

export default function PanelAdministrarVentas() {
  const [ventas, setVentas] = useState([]);
  const [venta, setVenta] = useState(null);

  const cargarProveedores = useCallback(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;

    fetch(`${backendURL}/ventas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVentas(data);
      })
      .catch((error) => console.error("Error al obtener compras:", error));
  }, []);

  useEffect(() => {
    cargarProveedores();
  }, [cargarProveedores]);

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    {
      link: "",
      name: "Administrar ventas",
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="panelAdministrar grid grid-cols-3 gap-5 h-full">
        <div className="col-span-1 panelAdministrar__listado overflow-y-auto">
          <ListaBasica
            objetos={ventas}
            onSuccess={cargarProveedores}
            url={"administrar-ventas"}
            coleccion={"ventas"}
            onHandleClickElemento={setVenta}
          />
        </div>
        <div className="col-span-2 panelAdministrar__form">
          <div className="flex items-center justify-between">
            <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">Ventas</h1>
            <Link
              to="/administrar-devoluciones"
              className="bg-[#ff8f6c] rounded-4xl text-white text-[1.2rem] sm:text-[2rem] px-4 py-1 hover:bg-[#ff5722] transition-colors duration-300 cursor-pointer"
            >
              Devoluciones
            </Link>
          </div>
          <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
          <PanelDetalleVenta venta={venta} />
        </div>
      </div>
    </div>
  );
}
