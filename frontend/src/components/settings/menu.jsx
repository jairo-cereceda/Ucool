import React from "react";

export default function MenuConfiguracion({ activeItem, onSelectItem }) {
  const opciones = [
    { name: "Preferencias" },
    { name: "Productos" },
    { name: "Pago" },
    { name: "Usuarios" },
    { name: "Inventario" },
    { name: "Reportes" },
    { name: "Backup" },
  ];
  return (
    <nav className="settings-nav">
      <h1 className="settings-nav__title">Configuración</h1>
      <div className="settings-nav__container flex flex-col gap-3">
        {opciones.map((opcion) => (
          <button
            key={opcion.name}
            onClick={() => onSelectItem(opcion.name)}
            className={`settings-nav__container__btn ${
              activeItem === opcion.name
                ? "settings-nav__container__btn--activo"
                : ""
            }`}
          >
            {opcion.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
