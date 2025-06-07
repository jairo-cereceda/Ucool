import React from "react";

export default function TablaDefault({ tabla }) {
  return (
    <table className="tabla-default">
      <tbody className="tabla-default__body">
        {tabla.map((fila, i) => (
          <tr
            key={i}
            className={`${
              i % 2 === 0
                ? "tabla-default__body__row--impar"
                : "tabla-default__body__row--par"
            } tabla-default__body__row`}
          >
            {fila.map((celda, j) =>
              j === 0 ? (
                <th key={j} className="tabla-default__body__row__th">
                  {celda}
                </th>
              ) : (
                <td key={j} className="tabla-default__body__row__td">
                  {celda}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
