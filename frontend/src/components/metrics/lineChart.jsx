import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LineChartCard() {
  const [progreso, setProgreso] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;
    fetch(`${backendURL}/progreso`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProgreso(data);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  let data = [];
  if (progreso) {
    progreso.map((p) => {
      data.push({
        fecha: p.creado_en.substring(0, 10),
        beneficios: parseFloat(p.beneficios.$numberDecimal),
      });
    });
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="beneficios" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
