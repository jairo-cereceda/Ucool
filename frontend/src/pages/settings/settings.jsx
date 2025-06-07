import React, { useState } from "react";
import MenuConfiguracion from "../../components/settings/menu";
import PanelProductos from "../../components/settings/pages/productos";
import PanelPago from "../../components/settings/pages/pago";
import PanelUsuarios from "../../components/settings/pages/usuarios";
import PanelInventario from "../../components/settings/pages/inventario";
import PanelReportes from "../../components/settings/pages/reportes";
import PanelBackup from "../../components/settings/pages/backup";
import Header from "../../components/header/headerDashboard";

import PanelPreferencias from "../../components/settings/pages/preferencias";

export default function PanelSettings() {
  const [activeMenuItem, setActiveMenuItem] = useState("Preferencias");
  const panels = {
    Preferencias: <PanelPreferencias />,
    Productos: <PanelProductos />,
    Pago: <PanelPago />,
    Usuarios: <PanelUsuarios />,
    Inventario: <PanelInventario />,
    Reportes: <PanelReportes />,
    Backup: <PanelBackup />,
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-col sm:flex-grow sm:flex-row">
        <MenuConfiguracion
          activeItem={activeMenuItem}
          onSelectItem={setActiveMenuItem}
        />

        {panels[activeMenuItem]}
      </div>
    </div>
  );
}
