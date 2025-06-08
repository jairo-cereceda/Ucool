import React, { useState } from "react";
import Header from "../../components/header/headerPage";
import { toast } from "react-toastify";
import Footer from "../../components/footer/footerPage";

export default function PanelContacto() {
  const [emailBody, setEmailBody] = useState({
    nombre: "",
    email: "",
    asunto: "",
    contenido: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailBody((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const backendURL = import.meta.env.VITE_API_HOST;
    try {
      const response = await fetch(`${backendURL}/contacto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailBody),
      });

      if (!response.ok) {
        toast.error("Algo salió mal");
        return;
      }

      await response.json();

      toast.success("Email enviado.");
      setEmailBody({ nombre: "", email: "", asunto: "", contenido: "" });
    } catch (error) {
      toast.error("Algo salió mal, por favor inténtelo más tarde.");
      error;
    }
  };

  return (
    <div className="contact flex flex-col justify-between min-h-screen">
      <Header />
      <div className="contact__container">
        <h1 className="contact__container__title">Contacto</h1>
        <form className="contact__container__form" onSubmit={handleSubmit}>
          <div className="contact__container__form__inputs  grid grid-cols-2 gap-5">
            <input
              type="text"
              name="nombre"
              id="nombre"
              placeholder="Nombre"
              className="contact__container__form__inputs__input w-[40rem] col-span-2 sm:col-span-1"
              onChange={handleChange}
              value={emailBody.nombre}
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="contact__container__form__inputs__input w-[40rem] col-span-2 sm:col-span-1"
              onChange={handleChange}
              value={emailBody.email}
            />
            <input
              type="text"
              name="asunto"
              id="asunto"
              placeholder="Asunto"
              className="contact__container__form__inputs__input col-span-2"
              onChange={handleChange}
              value={emailBody.asunto}
            />
            <textarea
              name="contenido"
              id="contenido"
              placeholder="Contenido"
              className="contact__container__form__inputs__input col-span-2"
              onChange={handleChange}
              value={emailBody.contenido}
            ></textarea>
          </div>
          <button type="submit" className="contact__container__form__submit">
            Enviar
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
