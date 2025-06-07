import React from "react";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";

export default function Carrito({
  productosSeleccionados,
  onHandleSubmit,
  setMetodoPago,
  handleCambiarDetalle,
  onHandleDescuento,
}) {
  const onSelectChange = (e) => {
    {
      const { name, value } = e.target;
      setMetodoPago((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="carritoContainer flex flex-col place-content-between">
      <div className="carritoContainer__main">
        <h2 className="carritoContainer__main__title">Carrito:</h2>
        {productosSeleccionados.length === 0 ? (
          <p className="carritoContainer__main__info">
            Seleccione al menos 1 elemento.
          </p>
        ) : (
          <ul className="carritoContainer__main__ul">
            {productosSeleccionados.map((producto, i) => (
              <div className="flex flex-col" key={i}>
                <div
                  className={`carritoContainer__main__ul__li ${
                    i % 2 === 0
                      ? "carritoContainer__main__ul__li--impar"
                      : "carritoContainer__main__ul__li--par"
                  }`}
                >
                  <li>
                    <div className="flex justify-between">
                      <p>{producto.nombre}</p>
                      <div className="flex gap-2">
                        <p>
                          {producto.precio_venta.$numberDecimal -
                            producto.descuento}{" "}
                          €
                        </p>
                        <button
                          className={`${
                            producto.cantidad === producto.stock
                              ? "cursor-not-allowed"
                              : ""
                          }`}
                          onClick={
                            producto.cantidad !== producto.stock
                              ? () =>
                                  handleCambiarDetalle(
                                    producto,
                                    (producto.cantidad || 0) + 1,
                                    producto.descuento
                                  )
                              : null
                          }
                        >
                          <FaPlus />
                        </button>
                        <button
                          onClick={() =>
                            handleCambiarDetalle(
                              producto,
                              (producto.cantidad || 0) - 1,
                              producto.descuento
                            )
                          }
                        >
                          <FaMinus />
                        </button>
                        <span
                          className={`cantidad ${
                            producto.cantidad === producto.stock
                              ? "cantidad-disabled"
                              : ""
                          }`}
                        >
                          {producto.cantidad}
                        </span>
                      </div>
                    </div>
                  </li>
                </div>
                <button
                  className="btn-descuento-carrito"
                  onClick={() => {
                    onHandleDescuento(producto);
                  }}
                >
                  Aplicar descuento
                </button>
              </div>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col carrito-bottom">
        <select name="metodo_pago" id="metodo_pago" onChange={onSelectChange}>
          <option value="tarjeta">Tarjeta</option>
          <option value="efectivo">Efectivo</option>
          <option value="cupon">Cupón</option>
        </select>

        <button
          className="carritoContainer__btn btnTerminarCompra"
          onClick={() => onHandleSubmit()}
        >
          Terminar compra
        </button>
      </div>
    </div>
  );
}
