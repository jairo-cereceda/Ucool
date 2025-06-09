import React, { useState, useEffect } from "react";
import ListaProductos from "../../components/main/listaProductos";
import Header from "../../components/header/headerDashboard";
import ListaCategorias from "../../components/main/listaCategorias";
import Carrito from "../../components/main/carrito";
import { RxCross2 } from "react-icons/rx";
import { IoCart } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

export default function PanelVenta() {
  const [activeItem, setActiveItem] = useState("categorias");
  const [categorias, setCategorias] = useState([]);
  const [modalSubmitVisible, setModalSubmitVisible] = useState(false);
  const [carritoMobile, setCarritoMobile] = useState(false);
  const [modalDescuentoCompraVisible, setModalDescuentoCompraVisible] =
    useState(false);
  const [modalDescuentoDetalleVisible, setModalDescuentoDetalleVisible] =
    useState(false);
  const [productosSeleccionado, setProductoSeleccionado] = useState([]);
  const [productosFotos, setProductosFotos] = useState([]);
  const [productoParaDescuento, setProductoParaDescuento] = useState(null);
  const [valorInputDescuentoProducto, setValorInputDescuentoProducto] =
    useState("");
  const [ventaInfo, setVentaInfo] = useState({
    metodo_pago: "tarjeta",
    observaciones: "",
    total: 0,
    estado: "pendiente",
    descuento: 0,
    email: "",
  });

  const handleCambiarObservaciones = (value) => {
    setVentaInfo((prevForm) => ({
      ...prevForm,
      observaciones: value,
    }));
  };

  const handleCambiarEmailTicket = (value) => {
    setVentaInfo((prevForm) => ({
      ...prevForm,
      email: value,
    }));
  };

  const handleCambiarDescuentoGlobal = (value) => {
    setVentaInfo((prevForm) => ({
      ...prevForm,
      descuento: parseFloat(value) || 0,
    }));
  };

  const handleCambiarDetalle = (producto, nuevaCantidad, descuentoProducto) => {
    if (nuevaCantidad < 1) {
      setProductoSeleccionado((prev) =>
        prev.filter((p) => p._id !== producto._id)
      );
      return;
    }

    setProductoSeleccionado((prev) =>
      prev.map((p) => {
        if (p._id === producto._id) {
          const pActualizado = { ...p };

          if (nuevaCantidad >= 1 && nuevaCantidad <= producto.stock) {
            pActualizado.cantidad = nuevaCantidad;
          }

          if (typeof descuentoProducto === "number" && descuentoProducto >= 0) {
            pActualizado.descuento = parseFloat(descuentoProducto);
          }

          return pActualizado;
        }
        return p;
      })
    );
  };

  const handleCategoriaProductos = (categoria) => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;
    fetch(`${backendURL}/productos/categoria/${categoria._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const productosConCampos = data.map((prod) => ({
          ...prod,
          cantidad: 0,
          descuento: 0,
        }));
        setProductosFotos(productosConCampos);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;
    fetch(`${backendURL}/categorias`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  const handleSeleccionarProducto = (producto) => {
    const productoYaSeleccionado = productosSeleccionado.find(
      (p) => p._id === producto._id
    );
    if (productoYaSeleccionado) {
      handleCambiarDetalle(
        producto,
        productoYaSeleccionado.cantidad + 1,
        productoYaSeleccionado.descuento
      );
    } else {
      const nuevoProducto = { ...producto, cantidad: 1, descuento: 0 };
      setProductoSeleccionado([...productosSeleccionado, nuevoProducto]);
    }
  };

  const handleSeleccionarCategoria = (categoria) => {
    handleCategoriaProductos(categoria);
    setActiveItem("productos");
  };

  const handleEmergenteSubmit = () => {
    if (productosSeleccionado.length === 0) {
      toast.error("Por favor, añade algún producto al carrito");
      return;
    }
    setModalSubmitVisible(!modalSubmitVisible);
  };

  const handleEmergenteDescuentoCompra = () => {
    setModalDescuentoCompraVisible(!modalDescuentoCompraVisible);
    setModalSubmitVisible(!modalSubmitVisible);
  };

  const toggleModalDescuentoDetalle = (productoTarget = null) => {
    if (modalDescuentoDetalleVisible) {
      setProductoParaDescuento(null);
      setValorInputDescuentoProducto("");
      setModalDescuentoDetalleVisible(false);
    } else if (productoTarget) {
      setProductoParaDescuento(productoTarget);
      setValorInputDescuentoProducto(String(productoTarget.descuento || 0));
      setModalDescuentoDetalleVisible(true);
    }
  };

  const handleSubmit = async () => {
    let subtotalDespuesDescuentosProducto = 0;
    productosSeleccionado.forEach((producto) => {
      const precioConDescuentoProducto =
        parseFloat(producto.precio_venta.$numberDecimal) -
        (producto.descuento || 0);
      subtotalDespuesDescuentosProducto +=
        precioConDescuentoProducto * producto.cantidad;
    });

    const totalFinalConDescuentoGlobal =
      subtotalDespuesDescuentosProducto - (ventaInfo.descuento || 0);

    const ventaDataEnviar = {
      metodo_pago: ventaInfo.metodo_pago,
      observaciones: ventaInfo.observaciones,
      total: totalFinalConDescuentoGlobal.toFixed(2),
      email: ventaInfo.email,
      estado: "pagado",
    };

    const detallesParaEnviar = productosSeleccionado.map((producto) => ({
      producto_id: producto._id,
      cantidad: producto.cantidad,
      precio_unitario:
        parseFloat(producto.precio_venta.$numberDecimal) -
        (producto.descuento || 0),
      descuento_aplicado_producto: producto.descuento || 0,
    }));

    try {
      const token = localStorage.getItem("token");
      const backendURL = import.meta.env.VITE_API_HOST;
      const response = await fetch(`${backendURL}/ventas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ventaData: ventaDataEnviar,
          detalles: detallesParaEnviar,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || `Error HTTP ${response.status}`);
      }
      await response.json();

      setProductoSeleccionado([]);
      setVentaInfo((prev) => ({
        ...prev,
        total: 0,
        descuento: 0,
        observaciones: "",
        email: "",
      }));
      setModalSubmitVisible(false);
      setActiveItem("categorias");
    } catch (e) {
      e;
    }
  };

  const panels = {
    categorias: (
      <ListaCategorias
        categorias={categorias}
        onCategoriaClick={handleSeleccionarCategoria}
      />
    ),
    productos: (
      <ListaProductos
        productos={productosFotos}
        onProductClick={handleSeleccionarProducto}
        isVista={true}
        onOcult={true}
      />
    ),
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <div className="h-full flex min-h-0">
        <div className="flex gap-2 w-full h-full">
          <div
            className={`flex-shrink-0 h-full carrito-mobile ${
              carritoMobile ? "" : "carrito-oculto"
            }`}
          >
            <Carrito
              productosSeleccionados={productosSeleccionado}
              onHandleSubmit={handleEmergenteSubmit}
              setMetodoPago={setVentaInfo}
              handleCambiarDetalle={handleCambiarDetalle}
              onHandleDescuento={toggleModalDescuentoDetalle}
            />
          </div>
          <button
            onClick={() => setCarritoMobile(!carritoMobile)}
            className="btn-ver-carrito"
          >
            <IoCart />
          </button>
          <div className="content flex-grow flex flex-col overflow-hidden">
            <div className="flex justify-between ">
              <h1 className="venta-title">Venta</h1>
              <button
                className={`volver-categorias ${
                  activeItem === "categorias"
                    ? "cursor-not-allowed"
                    : "volver-categorias-apto"
                }`}
                onClick={() => setActiveItem("categorias")}
              >
                <FaArrowLeft /> Categorías
              </button>
            </div>
            <div className="flex-grow overflow-y-auto min-h-0 p-4">
              {panels[activeItem]}
            </div>
          </div>
        </div>
      </div>

      {modalSubmitVisible && (
        <div>
          <div className="modal-back"></div>
          <div className="modal modal-final-compra">
            <div className="modal__header flex justify-between gap-20">
              <h2 className="modal__header__title">Terminar Compra</h2>
              <button
                className="modal__header__cross"
                onClick={handleEmergenteSubmit}
              >
                <RxCross2 />
              </button>
            </div>
            <div className="modal-final-compra__main">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="observaciones"
                  className="modal-final-compra__main__obs"
                >
                  Observaciones{" "}
                </label>
                <label htmlFor="email" className="hidden sm:block">
                  Mandar ticket:{" "}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email..."
                  id="email"
                  value={ventaInfo.email}
                  onChange={(e) => handleCambiarEmailTicket(e.target.value)}
                  className="modal-final-compra__main__email"
                />
              </div>
              <textarea
                name="observaciones"
                id="observaciones"
                value={ventaInfo.observaciones}
                onChange={(e) => handleCambiarObservaciones(e.target.value)}
              ></textarea>
              <div className="modal-final-compra__main__btns flex justify-center">
                <button
                  className="modal-final-compra__main__btns__descuento"
                  onClick={handleEmergenteDescuentoCompra}
                >
                  Aplicar descuento global
                </button>
                <button
                  onClick={handleSubmit}
                  className="modal-final-compra__main__btns__submit"
                >
                  Confirmar Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalDescuentoCompraVisible && (
        <div>
          {!modalSubmitVisible && <div className="modal-back"></div>}
          <div className="modal modal-descuento">
            <div className="modal__header flex justify-between gap-20">
              <h2 className="modal__header__title">Aplicar Descuento Global</h2>
              <button
                className="modal__header__cross"
                onClick={handleEmergenteDescuentoCompra}
              >
                <RxCross2 />
              </button>
            </div>
            <div className="modal-descuento__main">
              <label htmlFor="descuento_global">
                Cantidad a descontar (Global):
              </label>
              <input
                type="number"
                step="0.01"
                name="descuento_global"
                id="descuento_global"
                value={ventaInfo.descuento}
                onChange={(e) => handleCambiarDescuentoGlobal(e.target.value)}
              />
              <div className="modal-descuento__main__btns flex justify-center">
                <button
                  onClick={handleEmergenteDescuentoCompra}
                  className="modal-descuento__main__btns__submit"
                >
                  Confirmar Descuento Global
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalDescuentoDetalleVisible && productoParaDescuento && (
        <div>
          <div className="modal-back"></div>
          <div className="modal modal-descuento">
            <div className="modal__header flex justify-between gap-20">
              <h2 className="modal__header__title">
                Aplicar Descuento a {productoParaDescuento.nombre}
              </h2>
              <button
                className="modal__header__cross"
                onClick={() => toggleModalDescuentoDetalle()}
              >
                <RxCross2 />
              </button>
            </div>
            <div className="modal-descuento__main">
              <label htmlFor="descuento_producto_input">
                Cantidad a descontar del producto:
              </label>
              <input
                type="number"
                step="0.01"
                name="descuento_producto_input"
                id="descuento_producto_input"
                value={valorInputDescuentoProducto}
                onChange={(e) => setValorInputDescuentoProducto(e.target.value)}
                placeholder="0.00"
              />
              <div className="modal-descuento__main__btns flex justify-center">
                <button
                  onClick={() => {
                    const descuentoAplicar = parseFloat(
                      valorInputDescuentoProducto
                    );
                    if (!isNaN(descuentoAplicar) && descuentoAplicar >= 0) {
                      handleCambiarDetalle(
                        productoParaDescuento,
                        productoParaDescuento.cantidad,
                        descuentoAplicar
                      );
                    }
                    toggleModalDescuentoDetalle();
                  }}
                  className="modal-descuento__main__btns__submit"
                >
                  Confirmar Descuento Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
