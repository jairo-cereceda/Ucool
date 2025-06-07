import React from "react";

export default function CardMetricas({ title, content }) {
  const isDinero = content.tipo === "dinero";
  const isPorcentaje = content.tipo === "porcentaje";
  const isTotal = content.tipo === "total";
  const isNegative = content.cantidad <= 0;

  let formattedValue = content.cantidad;
  let className = "neutral-money-info";

  if (isDinero) {
    formattedValue = `${isNegative ? "" : "+"}${content.cantidad}€`;
    className = isNegative ? "negative-balance" : "positive-balance";
  } else if (isPorcentaje) {
    formattedValue = `${isNegative ? "" : "+"}${content.cantidad}%`;
    className = isNegative ? "negative-balance" : "positive-balance";
  } else if (isTotal) {
    formattedValue = `${content.cantidad}€`;
  }

  return (
    <div className="metricasCard">
      <h2 className="metricasCard__title">{title}</h2>
      <div className="metricasCard__content">
        <p className={className}>{formattedValue}</p>
      </div>
    </div>
  );
}
