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
import imageCompression from "browser-image-compression";

export default function PanelVistaProducto({ activePanel }) {
  const [activeItem, setActiveItem] = useState("Detalles");
  const [producto, setProducto] = useState({
    nombre: "",
    precio_compra: "",
    descripcion: "",
    sku: "",
    codigo_barras: "",
    precio_venta: "",
    stock: "",
    stock_minimo: "",
    proveedor_id: "",
    categoria_id: "",
    activo: true,
  });
  const [categorias, setCategorias] = useState();
  const [categoriaProducto, setCategoriaProducto] = useState();
  const [proveedor, setProveedor] = useState();
  const [proveedores, setProveedores] = useState();
  const [imageSrc, setImageSrc] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
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

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);

        setFile(compressedFile);

        const imageURL = URL.createObjectURL(compressedFile);
        setImageSrc(imageURL);
      } catch (error) {
        toast.error("Error al comprimir la imagen");
        error;
      }
    }
  };

  const { id } = useParams();

  const token = localStorage.getItem("token");
  const backendURL = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    fetch(`${backendURL}/productos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const precioVentaForm = data.precio_venta.$numberDecimal;
        const precioCompraForm = data.precio_compra.$numberDecimal;
        setProducto({
          ...data,
          precio_venta: precioVentaForm,
          precio_compra: precioCompraForm,
        });
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, [id, backendURL, token]);

  useEffect(() => {
    if (producto?.proveedor_id) {
      fetch(`${backendURL}/proveedores/${producto.proveedor_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setProveedor(data))
        .catch((error) => console.error("Error al obtener productos:", error));
    }
  }, [producto, backendURL, token]);

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
    fetch(`${backendURL}/proveedores`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProveedores(data);
        if (data && data.length > 0) {
          setProducto((prevProd) => {
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
    fetch(`${backendURL}/categorias`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, [producto, backendURL, token]);

  if (!producto || !proveedor || !categorias || !categoriaProducto)
    return <p>Cargando producto...</p>;

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "/administrar-categoria", name: "Administrar categorías" },
    {
      link: `/administrar-categoria/${producto.categoria_id}`,
      name: categoriaProducto.nombre,
    },
    { link: "", name: producto.nombre },
  ];

  const tabla = [
    ["Nombre", producto.nombre],
    ["Precio de Venta", producto.precio_venta],
    ["Precio de compra", producto.precio_compra],
    ["Descripción", producto.descripcion],
    ["Stock", producto.stock],
    ["Stock mínimo", producto.stock_minimo],
    ["Activo", producto.activo ? "Sí" : "No"],
    ["SKU", producto.sku],
    ["Código de barras", producto.codigo_barras],
    ["Proveedor", proveedor.nombre],
  ];

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
      value: producto.nombre,
    },
    {
      type: "number",
      title: "Precio de Venta",
      id: "precio_venta",
      value: producto.precio_venta,
    },
    {
      type: "number",
      title: "Precio de Compra",
      id: "precio_compra",
      value: producto.precio_compra,
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

  const panels = {
    Detalles: <TablaDefault tabla={tabla} />,
    Edicion: (
      <PanelFormulario
        form={form}
        img={file ? file : null}
        objeto={producto}
        hasInputFile={true}
        objetoId={producto._id}
        operacion="PUT"
        onChange={(key, value) =>
          setProducto((prev) => ({ ...prev, [key]: value }))
        }
        coleccion="productos"
        useNavigateURL={`/administrar-categoria/${producto.categoria_id}`}
      />
    ),
  };
  return (
    <div className="h-screen flex flex-col vista-producto">
      <Header />
      <div className="flex-grow flex vista-producto__container">
        <div className=" vista-producto__container vista-producto__container__imgDiv">
          {activeItem === "Edicion" || activePanel === "Edicion" ? (
            !producto.fotos ||
            producto.fotos.length === 0 ||
            !producto.fotos[0]?.url ? (
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
                          producto.fotos[0]?.url
                    }
                    className="rounded-[20px] vista-producto__container__imgDiv__img"
                    alt=""
                  />
                </button>
                <input
                  type="file"
                  name="fotos"
                  accept="image/*"
                  id="fotos"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            )
          ) : !producto.fotos ||
            producto.fotos.length === 0 ||
            !producto.fotos[0]?.url ? (
            <img
              src={preview}
              className="rounded-[20px] vista-producto__container__imgDiv__img"
              alt=""
            />
          ) : (
            <img
              src={`${import.meta.env.VITE_IMG_HOST}` + producto.fotos[0]?.url}
              className="rounded-[20px] vista-producto__container__imgDiv__img"
              alt=""
            />
          )}
        </div>
        <div className="flex-grow vista-producto__container__body">
          <div className="flex justify-between vista-producto__container__body__nav">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
                Producto {producto.nombre}
              </h1>
              <Breadcumb breadcumbs={breadcumb} />
            </div>
            <MenuAdministrar
              content={null}
              onSelectItem={setActiveItem}
              activeItem={activePanel || activeItem}
              elementoId={producto._id}
              coleccion="productos"
              list={false}
              useNavigateURL={`/administrar-categoria/${producto.categoria_id}`}
            />
          </div>
          <div className="vista-producto__container__body__item">
            {panels[activePanel || activeItem]}
          </div>
        </div>
      </div>
    </div>
  );
}
