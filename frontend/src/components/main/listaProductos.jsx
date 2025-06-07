import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import preview from "/src/assets/images/preview.jpg";
import { RxCross2 } from "react-icons/rx";

export default function ListaProductos({
  productos,
  onProductClick,
  isVista,
  modoEditar,
  modoEliminar,
  onOcult,
}) {
  const timeoutRef = useRef(null);
  const longPressTriggered = useRef(false);
  const [modalProductoVisible, setModalProductoVisible] = useState(false);
  const [productoModal, setProductoModal] = useState(null);
  const navigate = useNavigate();

  const handleMouseDown = (producto) => {
    longPressTriggered.current = false;
    if (isVista) {
      timeoutRef.current = setTimeout(() => {
        longPressTriggered.current = true;
        setProductoModal(producto);
        setModalProductoVisible(!modalProductoVisible);
      }, 1000);
    }
  };

  const handleMouseUp = () => {
    clearTimeout(timeoutRef.current);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
  };

  return (
    <div className="productsContainer grid grid-cols-4 gap-x-14 gap-y-10 w-full">
      {productos.length === 0 ? (
        <p>No hay productos creados.</p>
      ) : (
        productos.map((producto) =>
          onOcult ? (
            producto.activo ? (
              <Link to={`/vista-producto/${producto._id}`} key={producto._id}>
                <div
                  className="flex flex-col p-3 producto"
                  onClick={(e) => {
                    if (longPressTriggered.current) {
                      e.preventDefault();
                      return;
                    }
                    if (modoEliminar) {
                      e.preventDefault();
                      onProductClick(producto, e);
                    } else if (modoEditar) {
                      e.preventDefault();
                      navigate(`/vista-producto/${producto._id}/edit`);
                    } else {
                      {
                        isVista ? e.preventDefault() : null;
                      }
                      onProductClick(producto);
                    }
                  }}
                  onMouseDown={() => handleMouseDown(producto)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                >
                  {!producto.fotos ||
                  producto.fotos.length === 0 ||
                  !producto.fotos[0]?.url ? (
                    <img src={preview} alt="" />
                  ) : (
                    <img
                      src={
                        `${import.meta.env.VITE_IMG_HOST}` +
                        producto.fotos[0]?.url
                      }
                      alt=""
                    />
                  )}

                  <h2>{producto.nombre}</h2>
                  <p>{producto.precio_venta.$numberDecimal} €</p>
                </div>
              </Link>
            ) : null
          ) : (
            <Link to={`/vista-producto/${producto._id}`} key={producto._id}>
              <div
                className="flex flex-col p-3 producto"
                onClick={(e) => {
                  if (longPressTriggered.current) {
                    e.preventDefault();
                    return;
                  }
                  if (modoEliminar) {
                    e.preventDefault();
                    onProductClick(producto, e);
                  } else if (modoEditar) {
                    e.preventDefault();
                    navigate(`/vista-producto/${producto._id}/edit`);
                  } else {
                    {
                      isVista ? e.preventDefault() : null;
                    }
                    onProductClick(producto);
                  }
                }}
                onMouseDown={() => handleMouseDown(producto)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {!producto.fotos ||
                producto.fotos.length === 0 ||
                !producto.fotos[0]?.url ? (
                  <img src={preview} alt="" />
                ) : (
                  <img
                    src={
                      `${import.meta.env.VITE_IMG_HOST}` +
                      producto.fotos[0]?.url
                    }
                    alt=""
                  />
                )}

                <h2>{producto.nombre}</h2>
                <p>{producto.precio_venta.$numberDecimal} €</p>
              </div>
            </Link>
          )
        )
      )}
      {modalProductoVisible ? (
        <div>
          <div className="modal-back"></div>
          <div className="modal modal-final-compra">
            <div className="modal__header flex justify-between">
              <h2 className="modal__header__title">{productoModal.nombre}</h2>
              <button
                className="modal__header__cross"
                onClick={() => setModalProductoVisible()}
              >
                <RxCross2 />
              </button>
            </div>
            <div>
              {!productoModal.fotos ||
              productoModal.fotos.length === 0 ||
              !productoModal.fotos[0]?.url ? (
                <img src={preview} className="rounded-[20px]" alt="" />
              ) : (
                <img
                  src={
                    `${import.meta.env.VITE_IMG_HOST}` +
                    productoModal.fotos[0]?.url
                  }
                  className="rounded-[20px]"
                  alt=""
                />
              )}
              <div className="p-3">
                <h2 className="text-[2rem] font-bold">Descripción:</h2>
                <p className="text-[1.4rem]">{productoModal.descripcion}</p>
                <h2 className="text-[2rem] font-bold">Stock</h2>
                <p className="text-[1.4rem]">{productoModal.stock}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
