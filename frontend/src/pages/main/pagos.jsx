import React from "react";
import Header from "../../components/header/headerDashboard";
import HomeCard from "../../components/home/card";

export default function PanelPagos() {
  return (
    <div className="max-h-screen">
      <Header />
      <div className="flex items-center justify-center gap-5 px-5 panelAdminsitrar-list">
        <HomeCard
          img="resources/compras.png"
          title="Compras"
          direccion="/administrar-compras"
        />
        <HomeCard
          img="resources/gastos-operativos.png"
          title="Gastos operativos"
          direccion="/administrar-gastos-operativos"
        />
        <HomeCard
          img="resources/proveedores.png"
          title="Proveedores"
          direccion="/administrar-proveedores"
        />
      </div>
    </div>
  );
}
