import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/headerDashboard";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { MdOutlineModeEdit } from "react-icons/md";
import { TbDoorExit } from "react-icons/tb";

export default function PanelPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [establecimiento, setEstablecimiento] = useState(null);
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [imagenBanner, setImagenBanner] = useState(null);
  const { user } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const backendURL = import.meta.env.VITE_API_HOST;
    fetch(`${backendURL}/usuarios/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPerfil(data);
      })
      .catch((error) => console.error("Error al obtener productos:", error));

    fetch(`${backendURL}/establecimientos/${user.establecimiento_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEstablecimiento(data);
      })
      .catch((error) => console.error("Error al obtener productos:", error));

    fetch(`${backendURL}/fotos/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setImagenPerfil(data);
      })
      .catch((error) => console.error("Error al obtener imagen:", error));

    fetch(`${backendURL}/fotos/${user.establecimiento_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setImagenBanner(data);
      })
      .catch((error) => console.error("Error al obtener imagen:", error));
  }, [user]);

  if (!establecimiento || !perfil) return <p>cargando</p>;

  return (
    <div className="panelPerfil min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow flex flex-col">
        <img
          src={
            imagenBanner && imagenBanner.url
              ? `${import.meta.env.VITE_IMG_HOST}${imagenBanner.url}`
              : "src/assets/images/banner.png"
          }
          alt=""
          className="panelPerfil__img"
        />
        <div className="panelPerfil__info flex-grow">
          <div className="panelPerfil__info__lateral">
            <img
              src={
                imagenPerfil && imagenPerfil.url
                  ? `${import.meta.env.VITE_IMG_HOST}${imagenPerfil.url}`
                  : "src/assets/images/preview.jpg"
              }
              alt=""
              className="panelPerfil__info__lateral__img"
            />
            <Link
              to="/perfil/editar"
              className="panelPerfil__info__lateral__editar flex items-center gap-2"
            >
              <MdOutlineModeEdit /> Editar perfil
            </Link>
            <button
              className="panelPerfil__info__lateral__editar flex items-center gap-2 cursor-pointer"
              onClick={() => handleCerrarSesion()}
            >
              <TbDoorExit /> Cerrar sesión
            </button>
          </div>
          <div className="panelPerfil__info__datos flex flex-col gap-20 w-full">
            <div className="panelPerfil__info__datos__fila flex gap-100 flex-grow">
              <p>Establecimiento:</p>
              <p>{establecimiento.nombre}</p>
            </div>
            <div className="panelPerfil__info__datos__fila flex gap-100 w-full flex-grow">
              <p>Nombre Completo:</p>
              <p>{perfil.nombre}</p>
            </div>
            <div className="panelPerfil__info__datos__fila flex gap-100 w-full flex-grow">
              <p>DNI:</p>
              <p>{perfil.nif}</p>
            </div>
            <div className="panelPerfil__info__datos__fila flex gap-100 w-full flex-grow">
              <p>Rol:</p>
              <p>{perfil.rol}</p>
            </div>
            <div className="panelPerfil__info__datos__fila flex gap-100 flex-grow">
              <p>Correo electrónico:</p>
              <p>{perfil.email}</p>
            </div>
            <div className="panelPerfil__info__datos__fila flex gap-100 flex-grow">
              <p>Teléfono:</p>
              <p>{perfil.telefono}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
