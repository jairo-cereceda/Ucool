import React, { useState } from "react";
import RadioSetting from "../inputs/radio";
import CheckboxSettings from "../inputs/checkbox";

export default function PanelUsuarios() {
  const [isChecked, setIsChecked] = useState(false);

  const prueba2 = { label: "Manzana1", value: "manzana1" };

  return (
    <div className="flex-grow flex flex-col items-center mt-10 sm:mt-40">
      <div className="settings">
        <h2 className="settings__title">Preferencias</h2>
        <p className="settings__description">
          Cambia la forma en la que se ve la página.
        </p>
        <div className="settings__group">
          <CheckboxSettings
            title="Prueba"
            name="prueba1"
            option={prueba2}
            checked={isChecked}
            onChange={() => setIsChecked((prev) => !prev)}
          />
          <CheckboxSettings
            title="Prueba"
            name="prueba2"
            option={prueba2}
            checked={isChecked}
            onChange={() => setIsChecked((prev) => !prev)}
          />
          <CheckboxSettings
            title="Prueba"
            name="prueba3"
            option={prueba2}
            checked={isChecked}
            onChange={() => setIsChecked((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
}
