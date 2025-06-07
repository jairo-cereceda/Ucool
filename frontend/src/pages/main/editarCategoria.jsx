import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/header/headerDashboard";
import Breadcumb from "../../components/navigation/breadcumb";
import TablaDefault from "../../components/tables/tableDefault";
import MenuAdministrar from "../../components/main/tools/menuAdministrar";
import PanelFormulario from "../../components/forms/edicionProducto";
import preview from "/src/assets/images/preview.jpg";
import { MdOutlineEdit } from "react-icons/md";
import { toast } from "react-toastify";

export default function PanelEditarCategoria() {
  const activeItem = "Edicion";
  const [categoria, setCategoria] = useState({
    nombre: "",
    descripcion: "",
  });

  const [imageSrc, setImageSrc] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type || !file.type.startsWith("image/")) {
        toast.error("Solo se permiten imágenes.");
        return;
      }

      const imageURL = URL.createObjectURL(file);
      setImageSrc(imageURL);
      setFile(file);
    }
  };

  const { id } = useParams();

  const token = localStorage.getItem("token");
  const backendURL = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    fetch(`${backendURL}/categorias/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCategoria(data))
      .catch((error) => console.error("Error al obtener categoría:", error));
  }, [id, backendURL, token]);

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: `/administrar-categoria`, name: "Administrar categorías" },
    { link: "", name: `Editar ${categoria.nombre}` },
  ];

  if (!categoria) return <p>Cargando categoria...</p>;

  const form = [
    {
      type: "text",
      title: "Nombre",
      id: "nombre",
      required: true,
      value: categoria.nombre,
    },
    {
      type: "text",
      title: "Descripcion",
      id: "descripcion",
      value: categoria.descripcion,
    },
  ];

  const panels = {
    Edicion: (
      <PanelFormulario
        form={form}
        img={file ? file : null}
        objeto={categoria}
        hasInputFile={true}
        objetoId={categoria._id}
        operacion="PUT"
        onChange={(key, value) =>
          setCategoria((prev) => ({ ...prev, [key]: value }))
        }
        coleccion="categorias"
        useNavigateURL="/administrar-categoria"
      />
    ),
  };
  return (
    <div className="h-screen flex flex-col vista-producto">
      <Header />
      <div className="flex-grow flex vista-producto__container">
        <div className=" vista-producto__container vista-producto__container__imgDiv">
          {activeItem === "Edicion" ? (
            !categoria.fotos ||
            categoria.fotos.length === 0 ||
            !categoria.fotos[0]?.url ? (
              <div className="h-full">
                <button onClick={handleButtonEditClick} type="button h-full">
                  <div className="vista-producto__container__imgDiv__edit">
                    <MdOutlineEdit className="img-edit" />
                  </div>
                  <img
                    src={imageSrc ? imageSrc : preview}
                    className="rounded-[20px] vista-producto__container__imgDiv__img"
                    alt=""
                  />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  name="fotos"
                  id="fotos"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="h-full">
                <button onClick={handleButtonEditClick} type="button h-full">
                  <div className="vista-producto__container__imgDiv__edit">
                    <MdOutlineEdit className="img-edit" />
                  </div>
                  <img
                    src={
                      imageSrc
                        ? imageSrc
                        : `${import.meta.env.VITE_IMG_HOST}` +
                          categoria.fotos[0]?.url
                    }
                    className="rounded-[20px] vista-producto__container__imgDiv__img"
                    alt=""
                  />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  name="fotos"
                  id="fotos"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            )
          ) : !categoria.fotos ||
            categoria.fotos.length === 0 ||
            !categoria.fotos[0]?.url ? (
            <img
              src={preview}
              className="rounded-[20px] vista-producto__container__imgDiv__img"
              alt=""
            />
          ) : (
            <img
              src={`${import.meta.env.VITE_IMG_HOST}` + categoria.fotos[0]?.url}
              className="rounded-[20px] vista-producto__container__imgDiv__img"
              alt=""
            />
          )}
        </div>
        <div className="flex-grow vista-producto__container__body">
          <div className="flex justify-between vista-producto__container__body__nav">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
                Editar categoría
              </h1>
              <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
            </div>
            <MenuAdministrar
              content={null}
              activeItem={activeItem}
              elementoId={categoria._id}
              coleccion="categorias"
              useNavigateURL="/administrar-categoria"
            />
          </div>
          <div className="vista-producto__container__body__item">
            {panels[activeItem]}
          </div>
        </div>
      </div>
    </div>
  );
}
