import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiShow } from "react-icons/bi";
import { toast } from "react-toastify";
import ModalDelete from "../modals/modalDelete";

export default function ListaBasica({
  objetos,
  coleccion,
  url,
  onSuccess,
  onHandleClickElemento,
}) {
  const [deleteElement, setDeleteElement] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDeleteModal = () => {
    setDeleteModalVisible(!deleteModalVisible);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    let alertName = "data";
    if (coleccion === "productos") {
      alertName = "Producto";
    } else if (coleccion === "categorias") {
      alertName = "Categoría";
    } else if (coleccion === "compras") {
      alertName = "Compra";
    } else if (coleccion === "ventas") {
      alertName = "Venta";
    } else if (coleccion === "gastosOperativos") {
      alertName = "Gasto operativo";
    } else if (coleccion === "proveedores") {
      alertName = "Proveedor";
    } else if (coleccion === "devoluciones") {
      alertName = "Devolución";
    }

    try {
      const backendURL = import.meta.env.VITE_API_HOST;

      const response = await fetch(`${backendURL}/${coleccion}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success(alertName + " eliminado con éxito");
        if (onSuccess) onSuccess();
        setDeleteModalVisible(false);
      } else {
        const error = await response.json();
        console.error("Error al eliminar producto:", error);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  if (coleccion === "compras" || coleccion === "gastosOperativos") {
    return (
      <div className="listaElementos">
        <ul className="listaElementos__ul">
          {objetos.length > 0 ? (
            objetos.map((objeto, i) => (
              <li key={i} className="listaElementos__ul__li">
                <div className="flex gap-5  items-center justify-between listaElementos__ul__li__content">
                  <div className="flex gap-5 items-center listaElementos__ul__li__content__left">
                    <p>
                      {coleccion === "compras"
                        ? objeto.observaciones
                        : objeto.descripcion_gasto}
                    </p>
                    <p>
                      {coleccion === "compras"
                        ? objeto.precio_compra_total.$numberDecimal
                        : objeto.monto_gasto.$numberDecimal}{" "}
                      €
                    </p>
                    <Link
                      to={`/${url}/${objeto._id}/editar`}
                      className="flex gap-5 items-center listaElementos__ul__li__content__left__btn"
                    >
                      <MdOutlineModeEdit />
                    </Link>
                    <button
                      onClick={() => {
                        handleDeleteModal();
                        setDeleteElement(objeto);
                      }}
                      className="flex gap-5 items-center listaElementos__ul__li__content__left__btn"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                  <p>
                    {coleccion === "compras"
                      ? objeto.fecha_compra.substring(0, 10)
                      : objeto.fecha_gasto.substring(0, 10)}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p className="no-elementos">
              No hay {coleccion === "compras" ? "compras" : "gastos"}{" "}
              {coleccion === "compras" ? "realizadas" : "realizados"}.
            </p>
          )}
        </ul>
        {deleteModalVisible && (
          <ModalDelete
            controlModal={() => handleDeleteModal()}
            onDelete={() => handleDelete(deleteElement._id)}
          />
        )}
      </div>
    );
  } else if (coleccion === "proveedores") {
    return (
      <div className="listaElementos">
        <ul className="listaElementos__ul">
          {objetos.length > 0 ? (
            objetos.map((objeto, i) => (
              <li key={i} className="listaElementos__ul__li">
                <div className="flex gap-5  items-center justify-between listaElementos__ul__li__content">
                  <div className="flex gap-5 items-center listaElementos__ul__li__content__left">
                    <p>{objeto.nombre}</p>
                    <Link
                      to={`/administrar-proveedores/${objeto._id}/editar`}
                      className="flex gap-5 items-center listaElementos__ul__li__content__left__btn"
                    >
                      <MdOutlineModeEdit />
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteModalVisible(true);
                        setDeleteElement(objeto);
                      }}
                      className="flex gap-5 items-center listaElementos__ul__li__content__left__btn"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="no-elementos">No hay proveedores guardados.</p>
          )}
        </ul>
        {deleteModalVisible && (
          <ModalDelete
            controlModal={() => handleDeleteModal()}
            onDelete={() => handleDelete(deleteElement._id)}
          />
        )}
      </div>
    );
  } else if (coleccion === "ventas") {
    return (
      <div className="listaElementos h-full">
        <ul className="listaElementos__ul ">
          {objetos.length > 0 ? (
            objetos.map((objeto, i) => (
              <li key={i} className="listaElementos__ul__li">
                <div>
                  <div className="flex gap-5  items-center justify-between listaElementos__ul__li__content">
                    <div className="flex gap-5 items-center listaElementos__ul__li__content__left">
                      <p className="text-[1rem] sm:text-[1.6rem]">
                        {objeto.creado_en}
                      </p>
                      <button
                        onClick={() => onHandleClickElemento(objeto)}
                        className="flex gap-5 items-center listaElementos__ul__li__content__left__btn"
                      >
                        <BiShow />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteModalVisible(true);
                          setDeleteElement(objeto);
                        }}
                        className="flex gap-5 items-center listaElementos__ul__li__content__left__btn"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                    <p>{objeto.total.$numberDecimal} €</p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="no-elementos">No hay ventas guardadas.</p>
          )}
        </ul>
        {deleteModalVisible && (
          <ModalDelete
            controlModal={() => handleDeleteModal()}
            onDelete={() => handleDelete(deleteElement._id)}
          />
        )}
      </div>
    );
  } else if (coleccion === "devoluciones") {
    return (
      <div className="listaElementos">
        <ul className="listaElementos__ul">
          {objetos.length > 0 ? (
            objetos.map((objeto, i) => (
              <li key={i} className="listaElementos__ul__li">
                <div>
                  <div className="flex gap-5  items-center justify-between listaElementos__ul__li__content">
                    <div className="flex gap-5 items-center listaElementos__ul__li__content__left">
                      <p className="text-[1rem] sm:text-[1.6rem]">
                        Devolución venta {objeto.creado_en}
                      </p>
                      <button
                        onClick={() => onHandleClickElemento(objeto)}
                        className="flex gap-5 items-center listaElementos__ul__li__content__left__btn"
                      >
                        <BiShow />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteModalVisible(true);
                          setDeleteElement(objeto);
                        }}
                        className="flex gap-5 items-center listaElementos__ul__li__content__left__btn"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                    <p>{objeto.total_devuelto.$numberDecimal} €</p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="no-elementos">No hay devoluciones guardadas.</p>
          )}
        </ul>
        {deleteModalVisible && (
          <ModalDelete
            controlModal={() => handleDeleteModal()}
            onDelete={() => handleDelete(deleteElement._id)}
          />
        )}
      </div>
    );
  } else if (coleccion === "usuarios") {
    return (
      <div className="listaElementos">
        <ul className="listaElementos__ul">
          {objetos.map((objeto, i) => (
            <li key={i} className="listaElementos__ul__li">
              <div>
                <div className="flex gap-5  items-center justify-between listaElementos__ul__li__content">
                  <div className="flex gap-5 items-center listaElementos__ul__li__content__left">
                    <p>{objeto.nombre}</p>
                    <Link
                      to={`/${url}/${objeto._id}/editar`}
                      className="flex gap-5 items-center listaElementos__ul__li__content__left__btn"
                    >
                      <MdOutlineModeEdit />
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteModalVisible(true);
                        setDeleteElement(objeto);
                      }}
                      className="flex gap-5 items-center listaElementos__ul__li__content__left__btn"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {deleteModalVisible && (
          <ModalDelete
            controlModal={() => handleDeleteModal()}
            onDelete={() => handleDelete(deleteElement._id)}
          />
        )}
      </div>
    );
  }
}
