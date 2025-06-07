import React from "react";
import Header from "../../components/header/headerDashboard";
import SubmitComponent from "../../components/forms/components/submit";

export default function FormularioEditarPerfil({
  formData,
  onChange,
  onSubmit,
}) {
  return (
    <form className="formularioPerfil" onSubmit={onSubmit}>
      <div className="formularioPerfil__container flex flex-col gap-2">
        <div className="formularioPerfil__group flex flex-col gap-2">
          <label htmlFor="nombre" className="formularioPerfil__group__label">
            Nombre Completo:
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            className="formularioPerfil__group__input"
            value={formData.nombre}
            onChange={(e) => onChange("nombre", e.target.value)}
          />
        </div>
        <div className="formularioPerfil__group flex flex-col gap-2">
          <label htmlFor="nif" className="formularioPerfil__group__label">
            DNI:
          </label>
          <input
            type="text"
            name="nif"
            id="nif"
            className="formularioPerfil__group__input"
            value={formData.nif}
            onChange={(e) => onChange("nif", e.target.value)}
          />
        </div>
        <div className="formularioPerfil__group flex flex-col gap-2">
          <label
            htmlFor="pruebaprueba3"
            className="formularioPerfil__group__label"
          >
            Correo electrónico:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="formularioPerfil__group__input"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>
        <div className="formularioPerfil__group flex flex-col gap-2">
          <label
            htmlFor="pruebaprueba4"
            className="formularioPerfil__group__label"
          >
            Teléfono:
          </label>
          <input
            type="text"
            name="telefono"
            id="telefono"
            className="formularioPerfil__group__input"
            value={formData.telefono}
            onChange={(e) => onChange("telefono", e.target.value)}
          />
        </div>
      </div>
      <SubmitComponent />
    </form>
  );
}
