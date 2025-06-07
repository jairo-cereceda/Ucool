import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/header/headerDashboard";
import ListaBasica from "../../components/lists/listaBasica";
import Breadcumb from "../../components/navigation/breadcumb";
import PanelFormulario from "../../components/forms/edicionProducto";

export default function PanelAdministrarCompras() {
  const [compras, setCompras] = useState([]);
  const [productos, setProductos] = useState([]);
  const [compraForm, setCompraForm] = useState({
    cantidad_comprada: "",
    precio_compra_unitario: "",
    precio_compra_total: "",
    numero_factura_proveedor: "",
    observaciones: "",
    fecha_compra: "",
    producto_id: "",
  });

  const cargarCompras = useCallback(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;

    fetch(`${backendURL}/compras`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCompras(data);
        setCompraForm({
          cantidad_comprada: "",
          precio_compra_unitario: "",
          precio_compra_total: "",
          numero_factura_proveedor: "",
          observaciones: "",
          fecha_compra: "",
          producto_id: productos.length > 0 ? productos[0]._id : "",
        });
      })
      .catch((error) => console.error("Error al obtener compras:", error));
  }, [productos]);

  useEffect(() => {
    cargarCompras();
  }, [cargarCompras]);

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
          producto_id: data.length > 0 ? data[0]._id : "",
        }));
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

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
      type: "text",
      title: "Observaciones",
      id: "observaciones",
      value: compraForm.observaciones,
    },
    {
      type: "date",
      title: "Fecha de compra",
      id: "fecha_compra",
      required: true,
      value: compraForm.fecha_compra,
    },
    {
      type: "select",
      title: "Producto",
      id: "producto_id",
      value: compraForm.producto_id,
      options: productosJSON,
    },
  ];

  const breadcumb = [
    { link: "/administrar", name: "Administrar" },
    { link: "/administrar-pagos", name: "Pagos" },
    {
      link: `/administrar-compras`,
      name: "Administrar compras",
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="panelAdministrar grid grid-cols-3 gap-5 h-full">
        <div className="col-span-1 panelAdministrar__listado">
          <ListaBasica
            objetos={compras}
            url={"administrar-compras"}
            coleccion={"compras"}
            onSuccess={cargarCompras}
          />
        </div>
        <div className="col-span-2 panelAdministrar__form">
          <div className="mb-3">
            <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
              Compras
            </h1>
            <Breadcumb breadcumbs={breadcumb} cssClass="breadcumb-sm" />
          </div>
          <PanelFormulario
            form={form}
            objeto={compraForm}
            onChange={(key, value) =>
              setCompraForm((prevForm) => ({
                ...prevForm,
                [key]: value,
              }))
            }
            operacion="POST"
            coleccion="compras"
            onSuccess={cargarCompras}
          />
        </div>
      </div>
    </div>
  );
}
