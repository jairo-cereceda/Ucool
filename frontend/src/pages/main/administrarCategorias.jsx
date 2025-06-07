import React, { useState, useEffect } from "react";
import ListaCategorias from "../../components/main/listaCategorias";
import MenuAdministrar from "../../components/main/tools/menuAdministrar";
import Header from "../../components/header/headerDashboard";
import Breadcumb from "../../components/navigation/breadcumb";
import ModalDelete from "../../components/modals/modalDelete";
import { BiShow } from "react-icons/bi";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";

export default function PanelAdministrarCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [modoEliminar, setModoEliminar] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);

  const handleStockModal = () => {
    setStockModalVisible(!stockModalVisible);
  };

  const handleDeleteModal = () => {
    setDeleteModalVisible(!deleteModalVisible);
  };

  const deleteRequest = (categoria, e) => {
    e.preventDefault();
    setCategoryToDelete(categoria);
    setDeleteModalVisible(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;

    fetch(`${backendURL}/categorias`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Error al obtener productos:", error));

    fetch(`${backendURL}/productos/stock`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProductosBajoStock(data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, [setProductosBajoStock]);

  const handleEliminarConfirmado = async () => {
    const token = localStorage.getItem("token");

    try {
      const backendURL = import.meta.env.VITE_API_HOST;

      const response = await fetch(
        `${backendURL}/categorias/${categoryToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Categoría eliminada con éxito");
        setCategorias((prev) =>
          prev.filter((item) => item._id !== categoryToDelete._id)
        );
        setModoEliminar(false);
      } else {
        const error = await response.json();
        console.error("Error al eliminar producto:", error);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    } finally {
      setDeleteModalVisible(false);
      setCategoryToDelete(null);
    }
  };

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "", name: "Administrar categorías" },
  ];

  return (
    <div className="flex gap-2 flex-col">
      <Header />
      <div className="flex gap-2 flex-col px-10 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
            Categorías
          </h1>
          <div>
            <MenuAdministrar
              content="Categoría"
              link="/agregar-categoria"
              list={true}
              activarModoEliminar={() => setModoEliminar(!modoEliminar)}
              modoEliminar={modoEliminar}
              activarModoEditar={() => setModoEditar(!modoEditar)}
              modoEditar={modoEditar}
            />
            <button
              onClick={() => handleStockModal()}
              className="flex gap-2 items-center w-full mt-3 bg-[#ff8f6c] rounded-4xl text-white text-[1.2rem] sm:text-[1.6rem] px-4 py-2 hover:bg-[#ff5722] transition-colors duration-300 cursor-pointer"
            >
              <BiShow /> Productos con bajo stock
            </button>
          </div>
        </div>

        <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
        <ListaCategorias
          categorias={categorias}
          seleccionarElemento={deleteRequest}
          modoEliminar={modoEliminar}
          modoEditar={modoEditar}
        />
      </div>

      {stockModalVisible ? (
        <div>
          <div className="modal-back"></div>
          <div className="modal modal-stock">
            <div className="modal__header flex justify-between gap-20">
              <h2 className="modal__header__title">Productos con Stock bajo</h2>
              <button
                className="modal__header__cross"
                onClick={() => setStockModalVisible(false)}
              >
                <RxCross2 />
              </button>
            </div>
            <div className="modal-stock__main">
              <ul className="modal-stock__main__list">
                {productosBajoStock && productosBajoStock.length > 0
                  ? productosBajoStock.map((producto, i) => (
                      <li key={i} className="modal-stock__main__list__item">
                        {producto.nombre_producto}
                      </li>
                    ))
                  : "No hay producto con bajo stock"}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {deleteModalVisible && categoryToDelete ? (
        <ModalDelete
          controlModal={handleDeleteModal}
          onDelete={handleEliminarConfirmado}
        />
      ) : null}
    </div>
  );
}
