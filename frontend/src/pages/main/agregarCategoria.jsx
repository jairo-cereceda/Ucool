import React, { useState, useRef } from "react";
import PanelFormulario from "../../components/forms/edicionProducto";
import Header from "../../components/header/headerDashboard";
import Breadcumb from "../../components/navigation/breadcumb";
import { MdOutlineEdit } from "react-icons/md";
import { toast } from "react-toastify";

export default function AgregarCategoria() {
  const [categoria, setFormData] = useState({
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

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: `/administrar-categoria`, name: "Administrar categorías" },
    { link: "", name: `Agregar categoría` },
  ];

  return (
    <div className="flex flex-col sm:h-screen">
      <Header />
      <div className="agregar-elemento grid grid-cols-2 gap-2 h-full">
        <div className="agregar-elemento__imgControl flex justify-center">
          <button
            onClick={handleButtonEditClick}
            type="button"
            className="agregar-elemento__imgControl__btn flex items-center justify-center"
          >
            <div className="agregar-elemento__imgControl__btn__icon ">
              <MdOutlineEdit className="img-edit" />
            </div>
            <img
              src={imageSrc ? imageSrc : null}
              className="rounded-[20px]"
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

        <div className="p-10">
          <div className="mb-4">
            <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
              Agregar Categoría
            </h1>
            <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
          </div>
          <PanelFormulario
            form={form}
            img={file}
            objeto={categoria}
            onChange={(key, value) =>
              setFormData((prevForm) => ({
                ...prevForm,
                [key]: value,
              }))
            }
            operacion="POST"
            coleccion="categorias"
            useNavigateURL={`/administrar-categoria`}
          />
        </div>
      </div>
    </div>
  );
}
