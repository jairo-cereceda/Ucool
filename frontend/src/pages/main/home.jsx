import React from "react";
import Header from "../../components/header/headerDashboard";
import HomeCard from "../../components/home/card";
import { useAuth } from "../../context/AuthContext";

export default function PanelHome() {
  const { user } = useAuth();
  return (
    <div className="h-screen">
      <Header />
      <div className="flex items-center justify-center gap-5 px-5 homePanel">
        {user.rol === "administrador" ? (
          <HomeCard
            img="resources/store1.png"
            title="Administrar"
            direccion="/administrar"
          />
        ) : (
          <HomeCard
            img="resources/ventasjpg"
            title="Administrar"
            direccion="/administrar-ventas"
          />
        )}

        <HomeCard
          img="resources/store2.png"
          title="Venta"
          direccion="/vender"
        />
      </div>
    </div>
  );
}
