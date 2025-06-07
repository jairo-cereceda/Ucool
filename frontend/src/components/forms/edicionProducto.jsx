import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SubmitComponent from "./components/submit";

export default function PanelFormulario({
  form,
  onChange,
  img,
  objeto,
  objetoId,
  operacion,
  coleccion,
  onSuccess,
  useNavigateURL,
}) {
  const backendURL = import.meta.env.VITE_API_HOST;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosParaEnviar = {};

    form.forEach((item) => {
      const value = item.value;
      datosParaEnviar[item.id] = value;
    });

    if (coleccion === "productos") {
      if (datosParaEnviar.precio_compra)
        datosParaEnviar.precio_compra = parseFloat(
          datosParaEnviar.precio_compra
        );
      if (datosParaEnviar.precio_venta)
        datosParaEnviar.precio_venta = parseFloat(datosParaEnviar.precio_venta);
    } else if (coleccion === "categorias") {
      delete datosParaEnviar.precio_compra;
      delete datosParaEnviar.precio_venta;
    }

    if (coleccion === "compras") {
      try {
        const res = await fetch(
          `${backendURL}/productos/${datosParaEnviar.producto_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("No se pudo obtener el producto");
        }

        const data = await res.json();
        datosParaEnviar.proveedor_id = data.proveedor_id;
      } catch (error) {
        console.error("Error al obtener el proveedor del producto:", error);
      }
    }

    const formData = new FormData();

    if (img) formData.append("foto", img);

    if (operacion === "PUT") {
      if (
        (coleccion === "productos" && objeto?.fotos?.length > 0) ||
        (coleccion === "categorias" && objeto?.fotos?.length > 0)
      ) {
        datosParaEnviar.imagenAnteriorID = objeto.fotos[0]._id;
      }
    } else {
      delete datosParaEnviar._id;
      delete datosParaEnviar.imagenAnteriorID;
    }

    let jsonFieldName = "data";
    let alertName = "data";
    if (coleccion === "productos") {
      jsonFieldName = "producto";
      alertName = "Producto";
    } else if (coleccion === "categorias") {
      jsonFieldName = "categoria";
      alertName = "Categoría";
    } else if (coleccion === "compras") {
      jsonFieldName = "compra";
      alertName = "Compra";
    } else if (coleccion === "gastosOperativos") {
      jsonFieldName = "gastoOperativo";
      alertName = "Gasto operativo";
    } else if (coleccion === "proveedores") {
      jsonFieldName = "proveedor";
      alertName = "Proveedor";
    } else if (coleccion === "devoluciones") {
      jsonFieldName = "devolucion";
      alertName = "Devolución";
    }

    formData.append(jsonFieldName, JSON.stringify(datosParaEnviar));

    try {
      if (
        (objeto.cantidad_comprada < 1 || !objeto.cantidad_comprada) &&
        coleccion === "compras"
      ) {
        toast.error("Introduce una cantidad mayor que 0");
        return;
      } else if (coleccion === "proveedores" && objeto.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(objeto.email)) {
          toast.error("Usa un email válido");
          return;
        }
      }
      const url =
        operacion === "PUT"
          ? `${backendURL}/${coleccion}/${objetoId}`
          : `${backendURL}/${coleccion}`;

      const response = await fetch(url, {
        method: operacion,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success(alertName + " guardado con éxito");

        if (useNavigateURL) {
          navigate(useNavigateURL);
        }

        if (onSuccess) onSuccess();
      } else {
        toast.error("El formulario contiene algún error");
      }
    } catch (err) {
      toast.error("El servidor está teniendo problemas");
      err;
    }
  };

  return (
    <form className="formEditarProducto" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        {form.map((data, i) => (
          <div key={i} className="flex gap-1 formEditarProducto__container">
            <label
              htmlFor={data.id}
              className="formEditarProducto__container__label"
            >
              {data.title}
            </label>
            {data.type === "text" ||
            data.type === "date" ||
            data.type === "email" ||
            data.type === "number" ? (
              <input
                type={data.type}
                id={data.id}
                name={data.id}
                value={data.value}
                onChange={(e) => onChange(data.id, e.target.value)}
                {...(data.required ? { required: true } : {})}
                className="formEditarProducto__container__input"
              ></input>
            ) : (
              <select
                id={data.id}
                name={data.id}
                value={data.value}
                className="formEditarProducto__container__input"
                {...(data.required ? { required: true } : {})}
                onChange={(e) => onChange(data.id, e.target.value)}
              >
                {data.options.map((option, j) => (
                  <option key={j} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
      <SubmitComponent />
    </form>
  );
}
