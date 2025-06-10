import React, { useState, useEffect } from "react";
import ListaProductos from "../../components/main/listaProductos";
import MenuAdministrar from "../../components/main/tools/menuAdministrar";
import { useParams } from "react-router-dom";
import Header from "../../components/header/headerDashboard";
import Breadcumb from "../../components/navigation/breadcumb";
import ModalDelete from "../../components/modals/modalDelete";
import { toast } from "react-toastify";
import { BiShow } from "react-icons/bi";

export default function PanelAdministrarProductos() {
  const [productosFotos, setProductosFotos] = useState([]);
  const [categoriaProductos, setCategoriaProductos] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [verOcultos, setVerOcultos] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  const [modoEliminar, setModoEliminar] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);
  const { id } = useParams();

  const handleVerOcultos = () => {
    setVerOcultos(!verOcultos);
  };

  const handleDeleteModal = () => {
    setDeleteModalVisible(!deleteModalVisible);
  };

  const deleteRequest = (categoria, e) => {
    e.preventDefault();
    setProductToDelete(categoria);
    setDeleteModalVisible(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;

    fetch(`${backendURL}/productos/categoria/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProductosFotos(data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;
    fetch(`${backendURL}/categorias/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategoriaProductos(data);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, [id]);

  const handleEliminarConfirmado = async () => {
    const token = localStorage.getItem("token");

    if (modoEliminar) {
      try {
        const backendURL = import.meta.env.VITE_API_HOST;

        const response = await fetch(
          `${backendURL}/productos/${productToDelete._id}`,
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
          setProductosFotos((prev) =>
            prev.filter((item) => item._id !== productToDelete._id)
          );
          setModoEliminar(false);
        } else {
          const error = await response.json();
          console.error("Error al eliminar producto:", error);
        }
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  if (!productosFotos || !categoriaProductos)
    return <p>Cargando producto...</p>;

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "/administrar-categoria", name: "Administrar categorías" },
    {
      link: "",
      name: categoriaProductos.nombre,
    },
  ];

  return (
    <div className="flex gap-2 flex-col">
      <Header />
      <div className="flex gap-2 flex-col px-10 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
            Productos de {categoriaProductos.nombre}
          </h1>
          <div>
            <MenuAdministrar
              content="Producto"
              link={`/administrar-categoria/${id}/agregar-producto`}
              list={true}
              coleccion="productos"
              activarModoEliminar={() => setModoEliminar(!modoEliminar)}
              modoEliminar={modoEliminar}
              activarModoEditar={() => setModoEditar(!modoEditar)}
              modoEditar={modoEditar}
            />
            <button
              onClick={() => handleVerOcultos()}
              className={`flex justify-around mt-3 items-center verProductosOcultos ${
                !verOcultos ? "verProductosOcultos-activo" : ""
              }`}
            >
              <BiShow /> Ver productos ocultos
            </button>
          </div>
        </div>
        <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
        <ListaProductos
          productos={productosFotos}
          onOcult={verOcultos}
          isVista={false}
          onProductClick={deleteRequest}
          modoEliminar={modoEliminar}
          modoEditar={modoEditar}
        />
      </div>
      {deleteModalVisible && productToDelete ? (
        <ModalDelete
          controlModal={handleDeleteModal}
          onDelete={handleEliminarConfirmado}
        />
      ) : null}
    </div>
  );
}
