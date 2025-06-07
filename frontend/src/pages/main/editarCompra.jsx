import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/header/headerDashboard";
import Breadcumb from "../../components/navigation/breadcumb";
import TablaDefault from "../../components/tables/tableDefault";
import MenuAdministrar from "../../components/main/tools/menuAdministrar";
import PanelFormulario from "../../components/forms/edicionProducto";
import { MdOutlineEdit } from "react-icons/md";

export default function PanelEditarCompra() {
  const activeItem = "Edicion";
  const [compra, setCompra] = useState([]);
  const [productos, setProductos] = useState([]);
  const [compraForm, setCompraForm] = useState({
    cantidad_comprada: "",
    precio_compra_unitario: "",
    precio_compra_total: "",
    numero_factura_proveedor: "",
    fecha_compra: "",
    observaciones: "",
    producto_id: "",
  });

  const { id } = useParams();

  const token = localStorage.getItem("token");
  const backendURL = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    fetch(`${backendURL}/compras/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        setCompra(data);
        const precioUnitarioForm = data.precio_compra_unitario.$numberDecimal;
        const precioTotalForm = data.precio_compra_total.$numberDecimal;

        const fecha = data.fecha_compra
          ? new Date(data.fecha_compra).toISOString().split("T")[0]
          : "";

        setCompraForm({
          ...data,
          fecha_compra: fecha,
          precio_compra_unitario: precioUnitarioForm,
          precio_compra_total: precioTotalForm,
        });
      })
      .catch((error) => console.error("Error al obtener compra:", error));
  }, [id, backendURL, token]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;

    fetch(`${backendURL}/productos/fotos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);

        setCompraForm((prev) => ({
          ...prev,
          producto_id: data[0]._id,
        }));
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "/administrar-pagos", name: "Pagos" },
    {
      link: `/administrar-compras`,
      name: "Administrar compras",
    },
    {
      link: "",
      name: "Editar compra",
    },
  ];

  if (!compra) return <p>Cargando categoria...</p>;

  const productosJSON = [
    ...productos.map((p) => ({
      text: p.nombre,
      value: p._id,
    })),
  ];

  const form = [
    {
      type: "number",
      title: "Cantidad comprada",
      id: "cantidad_comprada",
      required: true,
      value: compraForm.cantidad_comprada,
    },
    {
      type: "number",
      title: "Precio por producto",
      id: "precio_compra_unitario",
      required: true,
      value: compraForm.precio_compra_unitario,
    },
    {
      type: "number",
      title: "Precio total",
      id: "precio_compra_total",
      required: true,
      value: compraForm.precio_compra_total,
    },
    {
      type: "text",
      title: "Número de factura del proveedor",
      id: "numero_factura_proveedor",
      value: compraForm.numero_factura_proveedor,
    },
    {
      type: "date",
      title: "Fecha de compra",
      id: "fecha_compra",
      required: true,
      value: compraForm.fecha_compra,
    },
    {
      type: "text",
      title: "Observaciones",
      id: "observaciones",
      value: compraForm.observaciones,
    },
    {
      type: "select",
      title: "Producto",
      id: "producto_id",
      value: compraForm.producto_id,
      options: productosJSON,
    },
  ];

  const panels = {
    Edicion: (
      <PanelFormulario
        form={form}
        img={null}
        objeto={compraForm}
        hasInputFile={false}
        objetoId={compra._id}
        operacion="PUT"
        onChange={(key, value) =>
          setCompraForm((prev) => ({ ...prev, [key]: value }))
        }
        coleccion="compras"
      />
    ),
  };
  return (
    <div className="h-screen flex flex-col vista-producto">
      <Header />
      <div className="flex-grow flex vista-producto__container">
        <div className="flex-grow vista-producto__container__body">
          <div className="flex justify-between vista-producto__container__body__nav editar-mobile-flex">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
                Editar compra
              </h1>
              <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
            </div>
            <MenuAdministrar
              content={null}
              activeItem={activeItem}
              elementoId={compra._id}
              coleccion="compras"
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
