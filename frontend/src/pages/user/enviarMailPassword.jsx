import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PanelEnviarMailPass() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Usa un email válido");
      return;
    }

    e.preventDefault();
    const backendURL = import.meta.env.VITE_API_HOST;
    const response = await fetch(`${backendURL}/auth/email-cambiar-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || `Error HTTP ${response.status}`);
    } else {
      toast.success("Email enviado");
      navigate("/login");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="registroEst">
        <div className="flex  flex-col gap-5 items-center registroEst__container__main text-2xl">
          <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
            Cambiar contraseña
          </h1>
          <p>
            Escribenos tu correo para mandarte el email de cambio de contraseña.
          </p>
          <div className="w-full flex items-center font-bold text-3xl gap-7 ml-2">
            <label htmlFor="email" className="text-left">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              required
              placeholder="ejemplo@ejemplo.com"
              className="w-full p-4 text-white border-[#fff] border-1 rounded-4xl"
            />
          </div>
          <button
            type="submit"
            className="bg-[#ff8f6c] rounded-4xl text-white text-[1.6rem] px-4 py-2 hover:bg-[#ff5722] transition-colors duration-300 cursor-pointer mb-3"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
