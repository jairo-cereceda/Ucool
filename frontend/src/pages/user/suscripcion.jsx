import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PanelSuscripcion() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logout } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");

  const token = localStorage.getItem("token");

  const handleCerrarSesion = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.isSubscribed) {
      navigate("/");
      return;
    }
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Usa un email válido");
      return;
    }

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        email,
      },
    });

    if (error) {
      toast.error("Método de pago inválido");
      console.error(error);
      return;
    }

    const backendURL = import.meta.env.VITE_API_HOST;
    const response = await fetch(`${backendURL}/tarjetas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        payment_method_id: paymentMethod.id,
        plan_id: "price_1RUufdPPnLmZEjMGver2U8YT",
      }),
    });

    await response.json();

    if (!response.ok) {
      toast.error("Error al suscribirse");
    } else {
      logout();
      navigate("/login");
    }
  };
  return (
    <div className="h-screen">
      <form onSubmit={handleSubmit} className="suscription flex h-full">
        <div className="suscription__container absolute left-0">
          <h1 className="text-[2.8rem] sm:text-[4.8rem] font-bold">
            Suscripción
          </h1>
          <div>
            <input
              type="email"
              id="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="suscription__container__email"
              required
            />
            <div className="bg-white p-5 rounded-4xl">
              <CardElement />
            </div>
            <div className="flex gap-5 mt-10">
              <button
                type="submit"
                disabled={!stripe}
                className="suscription__container__submit"
              >
                Guardar tarjeta
              </button>
              <button
                onClick={() => handleCerrarSesion()}
                className="suscription__container__logout"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
        <img src="resources/mostrador.png" alt="" className="w-full" />
      </form>
    </div>
  );
}
