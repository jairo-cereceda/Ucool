import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import PanelFormulario from "../../components/forms/edicionProducto";
import Header from "../../components/header/headerDashboard";
import { MdOutlineEdit } from "react-icons/md";
import Breadcumb from "../../components/navigation/breadcumb";
import { toast } from "react-toastify";

export default function AgregarProducto() {
  const { id } = useParams();
  const [categorias, setCategorias] = useState();
  const [proveedores, setProveedores] = useState();
  const [imageSrc, setImageSrc] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [categoriaProducto, setCategoriaProducto] = useState();

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

      if (file.size > 2 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande, máximo 2 MB");
        return;
      }

      const imageURL = URL.createObjectURL(file);
      setImageSrc(imageURL);
      setFile(file);
    }
  };

  const [producto, setFormData] = useState({
    nombre: "",
    precio_compra: "",
    descripcion: "",
    sku: "",
    codigo_barras: "",
    precio_venta: "",
    stock: "",
    stock_minimo: "",
    proveedor_id: "",
    categoria_id: id,
    activo: true,
  });
  const token = localStorage.getItem("token");
  const backendURL = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    fetch(`${backendURL}/proveedores`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProveedores(data);
        if (data && data.length > 0) {
          setFormData((prevProd) => {
            if (prevProd.proveedor_id === "") {
              return { ...prevProd, proveedor_id: data[0]._id };
            }
            return prevProd;
          });
        }
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, [backendURL, token]);

  useEffect(() => {
    fetch(`${backendURL}/categorias/${producto.categoria_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategoriaProducto(data);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, [producto, backendURL, token]);

  useEffect(() => {
    fetch(`${backendURL}/categorias`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategorias(data);
        if (data && data.length > 0) {
          setFormData((prevProd) => {
            if (prevProd.categoria_id === "") {
              return { ...prevProd, categoria_id: data[0]._id };
            }
            return prevProd;
          });
        }
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, [backendURL, token]);

  if (!proveedores || !categorias || !categoriaProducto)
    return <p>Cargando producto...</p>;

  const categoriasJSON = [
    ...categorias.map((categoria) => ({
      text: categoria.nombre,
      value: categoria._id,
    })),
  ];

  const proveedoresJSON = [
    ...proveedores.map((p) => ({
      text: p.nombre,
      value: p._id,
    })),
  ];

  const form = [
    {
      type: "text",
      title: "Nombre",
      id: "nombre",
      required: true,
      value: producto.nombre,
    },
    {
      type: "number",
      title: "Precio de Venta",
      id: "precio_venta",
      required: true,
      value:
        typeof producto.precio_venta === "object"
          ? producto.precio_venta?.$numberDecimal ?? ""
          : producto.precio_venta,
    },
    {
      type: "number",
      title: "Precio de Compra",
      id: "precio_compra",
      required: true,
      value:
        typeof producto.precio_compra === "object"
          ? producto.precio_compra?.$numberDecimal ?? ""
          : producto.precio_compra,
    },
    {
      type: "text",
      title: "Descripcion",
      id: "descripcion",
      value: producto.descripcion,
    },
    {
      type: "number",
      title: "Stock",
      id: "stock",
      value: producto.stock,
    },
    {
      type: "number",
      title: "Stock mínimo",
      id: "stock_minimo",
      value: producto.stock_minimo,
    },
    {
      type: "select",
      title: "Activo",
      id: "activo",
      value: producto.activo,
      options: [
        { text: "Sí", value: true },
        { text: "No", value: false },
      ],
    },
    {
      type: "text",
      title: "SKU",
      id: "sku",
      value: producto.sku,
    },
    {
      type: "text",
      title: "Código de barras",
      id: "codigo_barras",
      value: producto.codigo_barras,
    },
    {
      type: "select",
      title: "Proveedor",
      id: "proveedor_id",
      value: producto.proveedor_id,
      options: proveedoresJSON,
    },
    {
      type: "select",
      title: "Categoría",
      id: "categoria_id",
      value: producto.categoria_id,
      options: categoriasJSON,
    },
  ];

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "/administrar-categoria", name: "Administrar categorías" },
    {
      link: `/administrar-categoria/${id}`,
      name: categoriaProducto.nombre,
    },
    {
      link: ``,
      name: "Agregar producto",
    },
  ];

  return (
    <div className="flex flex-col h-screen">
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
              Agregar Producto
            </h1>
            <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
          </div>
          <PanelFormulario
            form={form}
            img={file}
            objeto={producto}
            hasInputFile={true}
            objetoId={producto._id}
            onChange={(key, value) =>
              setFormData((prevForm) => ({
                ...prevForm,
                [key]: value,
              }))
            }
            operacion="POST"
            coleccion="productos"
            useNavigateURL={`/administrar-categoria/${id}`}
          />
        </div>
      </div>
    </div>
  );
}
