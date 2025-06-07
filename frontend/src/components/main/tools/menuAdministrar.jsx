import React, { useState } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import ModalDelete from "../../modals/modalDelete";
import { useNavigate } from "react-router-dom";

export default function MenuAdministrar({
  content,
  link,
  activeItem,
  onSelectItem,
  coleccion,
  elementoId,
  list,
  activarModoEliminar,
  modoEliminar,
  activarModoEditar,
  modoEditar,
  useNavigateURL,
}) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleListDelete = (e) => {
    e.preventDefault();
    activarModoEliminar();
  };

  const handleListEdit = (e) => {
    e.preventDefault();
    activarModoEditar();
  };

  const handleDelete = async () => {
    if (!list) {
      const token = localStorage.getItem("token");

      try {
        const backendURL = import.meta.env.VITE_API_HOST;

        const response = await fetch(
          `${backendURL}/${coleccion}/${elementoId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let alertName = "data";
        if (coleccion === "productos") {
          alertName = "Producto";
        } else if (coleccion === "categorias") {
          alertName = "Categoría";
        } else if (coleccion === "compras") {
          alertName = "Compra";
        } else if (coleccion === "gastosOperativos") {
          alertName = "Gasto operativo";
        } else if (coleccion === "proveedores") {
          alertName = "Proveedor";
        } else if (coleccion === "devoluciones") {
          alertName = "Devolución";
        }

        if (response.ok) {
          toast.success(alertName + " eliminado con éxito");
          navigate(useNavigateURL);
        } else {
          const error = await response.json();
          console.error("Error al eliminar producto:", error);
        }
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  return (
    <div className="flex gap-2 menuAdministrar">
      <button
        className={` ${activeItem === "Edicion" ? "editar-activo" : ""} ${
          modoEditar ? "editar-activo" : ""
        } rounded-[100%] p-2 cursor-pointer flex items-center`}
        onClick={
          !list
            ? () =>
                onSelectItem(activeItem === "Detalles" ? "Edicion" : "Detalles")
            : handleListEdit
        }
      >
        <MdOutlineModeEdit className="flex-grow" />
      </button>
      <button
        className={`rounded-[100%] p-2 cursor-pointer flex items-center ${
          modoEliminar ? "editar-activo" : null
        }`}
        onClick={!list ? () => setDeleteModalVisible(true) : handleListDelete}
      >
        <RiDeleteBin6Line className="flex-grow" />
      </button>
      {content === null ? null : (
        <Link to={link} className="rounded-[18px] p-2 menuAdministrar__agregar">
          Agregar {content}
        </Link>
      )}

      {deleteModalVisible && (
        <ModalDelete
          controlModal={() => setDeleteModalVisible(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
