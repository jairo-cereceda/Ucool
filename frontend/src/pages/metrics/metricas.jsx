import React, { useEffect, useState } from "react";
import Header from "../../components/header/headerDashboard";
import CardMetricas from "../../components/metrics/metricCard";
import TablaDefault from "../../components/tables/tableDefault";
import LineChartCard from "../../components/metrics/lineChart";

export default function PanelMetricas() {
  const [datos, setDatos] = useState({
    obtenerIngresosMesActual: { cantidad: 0, tipo: "total" },
    obtenerGastosMesActual: { cantidad: 0, tipo: "dinero" },
    obtenerIngresosMesAnterior: { cantidad: 0, tipo: "total" },
    obtenerGastosMesAnterior: { cantidad: 0, tipo: "dinero" },
    obtenerProductoMasVendido: "",
    obtenerProductoMenosVendido: "",
    obtenerProductoMayorIngreso: "",
    obtenerProductoMenorIngreso: "",
    obtenerProductoMayorBeneficio: "",
    obtenerProductoMenorBeneficio: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;

    fetch(`${backendURL}/estadisticas/obtenerIngresosMesActual`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setDatos((prevDatos) => ({
          ...prevDatos,
          obtenerIngresosMesActual: {
            ...prevDatos.obtenerIngresosMesActual,
            cantidad: data.ingresosTotalesMes,
          },
        }))
      )
      .catch((error) => console.error("Error al obtener productos:", error));

    fetch(`${backendURL}/estadisticas/obtenerGastosMesActual`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setDatos((prevDatos) => ({
          ...prevDatos,
          obtenerGastosMesActual: {
            ...prevDatos.obtenerGastosMesActual,
            cantidad: -data.gastosGeneralesMes,
          },
        }))
      )
      .catch((error) => console.error("Error al obtener productos:", error));

    fetch(`${backendURL}/estadisticas/obtenerIngresosMesAnterior`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setDatos((prevDatos) => ({
          ...prevDatos,
          obtenerIngresosMesAnterior: {
            ...prevDatos.obtenerIngresosMesAnterior,
            cantidad: data.ingresosTotalesMes,
          },
        }))
      )
      .catch((error) => console.error("Error al obtener productos:", error));

    fetch(`${backendURL}/estadisticas/obtenerGastosMesAnterior`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setDatos((prevDatos) => ({
          ...prevDatos,
          obtenerGastosMesAnterior: {
            ...prevDatos.obtenerGastosMesAnterior,
            cantidad: data.gastosGeneralesMes,
          },
        }))
      )
      .catch((error) => console.error("Error al obtener productos:", error));

    fetch(`${backendURL}/estadisticas/obtenerProductoMasVendido`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDatos((prevDatos) => ({
          ...prevDatos,
          obtenerProductoMasVendido: data.nombreProducto,
        }));
      })
      .catch((error) => console.error("Error al obtener productos:", error));

    fetch(`${backendURL}/estadisticas/obtenerProductoMenosVendido`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setDatos((prevDatos) => ({
          ...prevDatos,
          obtenerProductoMenosVendido: data.nombreProducto,
        }))
      )
      .catch((error) => console.error("Error al obtener productos:", error));

    fetch(`${backendURL}/estadisticas/obtenerProductoMayorIngreso`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setDatos((prevDatos) => ({
          ...prevDatos,
          obtenerProductoMayorIngreso: data.nombreProducto,
        }))
      )
      .catch((error) => console.error("Error al obtener productos:", error));

    fetch(`${backendURL}/estadisticas/obtenerProductoMenorIngreso`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setDatos((prevDatos) => ({
          ...prevDatos,
          obtenerProductoMenorIngreso: data.nombreProducto,
        }))
      )
      .catch((error) => console.error("Error al obtener productos:", error));

    fetch(`${backendURL}/estadisticas/obtenerProductoMayorBeneficio`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setDatos((prevDatos) => ({
          ...prevDatos,
          obtenerProductoMayorBeneficio: data.nombreProducto,
        }))
      )
      .catch((error) => console.error("Error al obtener productos:", error));

    fetch(`${backendURL}/estadisticas/obtenerProductoMenorBeneficio`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setDatos((prevDatos) => ({
          ...prevDatos,
          obtenerProductoMenorBeneficio: data.nombreProducto,
        }))
      )
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  const beneficiosMesActual =
    Number(datos.obtenerIngresosMesActual.cantidad) +
    Number(datos.obtenerGastosMesActual?.cantidad || 0);

  const beneficiosMesActualRedondeados = parseFloat(
    beneficiosMesActual.toFixed(2)
  );

  const beneficiosMesAnterior =
    Number(datos.obtenerIngresosMesAnterior.cantidad) +
    Number(datos.obtenerGastosMesAnterior?.cantidad || 0);

  const beneficiosMesAnteriorRedondeados = parseFloat(
    beneficiosMesAnterior.toFixed(2)
  );

  const porcentajeCrecimiento =
    (beneficiosMesActualRedondeados * 100) / beneficiosMesAnteriorRedondeados;

  const porcentajeCrecimientoRedondeado = parseFloat(
    porcentajeCrecimiento.toFixed(2)
  );

  const tabla = [
    ["Producto más vendido", datos.obtenerProductoMasVendido],
    ["Producto menos vendido", datos.obtenerProductoMenosVendido],
    ["Producto que más ingresos da", datos.obtenerProductoMayorIngreso],
    ["Producto que menos ingresos da", datos.obtenerProductoMenorIngreso],
    ["Producto con mayor beneficio", datos.obtenerProductoMayorBeneficio],
    ["Producto con menor beneficio", datos.obtenerProductoMenorBeneficio],
  ];
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <div className="metricas flex flex-col justify-center items-center">
        <h1 className="metricas__title w-full">Métricas</h1>
        <div className="metricas__body grid grid-cols-2 gap-7 w-full">
          <div className="metricas-row">
            <div className="metricasCard-chart mb-5">
              <h2 className="metricasCard-chart__title">Beneficios por mes</h2>
              <div className="metricasCard-chart__content">
                <LineChartCard />
              </div>
            </div>

            <TablaDefault tabla={tabla} />
          </div>
          <div className="flex flex-col gap-7">
            <CardMetricas
              title="Beneficios de este mes"
              content={{
                cantidad: beneficiosMesActualRedondeados,
                tipo: "dinero",
              }}
            />
            <CardMetricas
              title="Gastos de este mes"
              content={datos.obtenerGastosMesActual}
            />
            <CardMetricas
              title="Ingresos de este mes"
              content={datos.obtenerIngresosMesActual}
            />
            <CardMetricas
              title="Porcentaje de crecimiento"
              content={{
                cantidad: porcentajeCrecimientoRedondeado,
                tipo: "porcentaje",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
