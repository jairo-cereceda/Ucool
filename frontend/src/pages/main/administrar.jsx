import React from "react";
import Header from "../../components/header/headerDashboard";
import HomeCard from "../../components/home/card";

export default function PanelAdministrar() {
  return (
    <div className="flex gap-2 flex-col">
      <Header />
      <div className="flex items-center justify-center gap-5 px-5 panelAdminsitrar-list">
        <HomeCard
          img="resources/productos.jpg"
          title="Productos"
          direccion="/administrar-categoria"
        />
        <HomeCard
          img="resources/pagos.jpg"
          title="Pagos"
          direccion="/administrar-pagos"
        />
        <HomeCard
          img="resources/ventas.jpg"
          title="Ventas"
          direccion="/administrar-ventas"
        />
        <HomeCard
          img="resources/usuario.jpg"
          title="Usuarios"
          direccion="/administrar-usuarios"
        />
      </div>
    </div>
  );
}
