import React from "react";
import Header from "../../components/header/headerDashboard";
import HomeCard from "../../components/home/card";

export default function PanelPagos() {
  return (
    <div className="max-h-screen">
      <Header />
      <div className="flex items-center justify-center gap-5 px-5 panelAdminsitrar-list">
        <HomeCard
          img="resources/compras.jpg"
          title="Compras"
          direccion="/administrar-compras"
        />
        <HomeCard
          img="resources/gastos-operativos.jpg"
          title="Gastos operativos"
          direccion="/administrar-gastos-operativos"
        />
        <HomeCard
          img="resources/proveedores.jpg"
          title="Proveedores"
          direccion="/administrar-proveedores"
        />
      </div>
    </div>
  );
}
