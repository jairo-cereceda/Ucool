import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PanelCambiarPass() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "La contraseña debe tener al menos 8 caracteres y contener letras y números"
      );
      return;
    }

    if (password === passwordConfirm) {
      e.preventDefault();
      const token = searchParams.get("token");
      const backendURL = import.meta.env.VITE_API_HOST;
      const response = await fetch(`${backendURL}/auth/cambiar-pass/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPass: password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || `Error HTTP ${response.status}`);
      } else {
        toast.success("Contraseña cambiada correctamente");
        navigate("/login");
      }
    } else {
      toast.error("Las contraseñas no coinciden");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center esperaVerificar">
      <form onSubmit={handleSubmit} className="registroEst">
        <div className="flex  flex-col gap-5 items-center registroEst__container__main text-2xl">
          <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
            Cambiar contraseña
          </h1>
          <div className="w-full flex items-center font-bold text-3xl gap-7 ml-2">
            <input
              type="password"
              name="pass"
              id="pass"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-white border-[#fff] border-1 rounded-4xl"
              required
            />
          </div>
          <div className="w-full flex items-center font-bold text-3xl gap-7 ml-2">
            <input
              type="password"
              name="passConfirm"
              id="passConfirm"
              placeholder="Confirmar contraseña"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              className="w-full p-4 text-white border-[#fff] border-1 rounded-4xl"
            />
          </div>
          <button
            type="submit"
            className="bg-[#ff8f6c] rounded-4xl text-white text-[1.6rem] px-4 py-2 hover:bg-[#ff5722] transition-colors duration-300 cursor-pointer mb-3"
          >
            Cambiar contraseña
          </button>
        </div>
      </form>
    </div>
  );
}
