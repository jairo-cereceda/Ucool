import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header/headerDashboard";
import FormularioEditarPerfil from "../../components/forms/edicionPerfil";
import { useNavigate } from "react-router-dom";
import preview from "/src/assets/images/preview.jpg";
import banner from "/src/assets/images/banner.png";
import imageCompression from "browser-image-compression";

export default function PanelEditarPerfil() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [establecimiento, setEstablecimiento] = useState(null);
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [imagenBanner, setImagenBanner] = useState(null);

  const [imagenPerfilSrc, setImagenPerfilSrc] = useState(null);
  const [imagenBannerSrc, setImagenBannerSrc] = useState(null);

  const [fileImagenPerfil, setFileImagenPerfil] = useState(null);
  const [fileImagenBanner, setFileImagenBanner] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    nif: "",
    email: "",
    telefono: "",
  });
  const { user } = useAuth();
  const imgPerfilRef = useRef(null);
  const imgBannerRef = useRef(null);

  const handleButtonEditPerfilClick = () => {
    imgPerfilRef.current.click();
  };

  const handleButtonEditBannerClick = () => {
    imgBannerRef.current.click();
  };

  const handleFilePerfilChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type || !file.type.startsWith("image/")) {
        toast.error("Solo se permiten imágenes.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande, máximo 2 MB");
        return;
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);

        setFileImagenPerfil(compressedFile);

        const imageURL = URL.createObjectURL(compressedFile);
        setImagenPerfilSrc(imageURL);
      } catch (error) {
        toast.error("Error al comprimir la imagen");
        error;
      }
    }
  };

  const handleFileBannerChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type || !file.type.startsWith("image/")) {
        toast.error("Solo se permiten imágenes.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande, máximo 2 MB");
        return;
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);

        setFileImagenBanner(compressedFile);

        const imageURL = URL.createObjectURL(compressedFile);
        setImagenBannerSrc(imageURL);
      } catch (error) {
        toast.error("Error al comprimir la imagen");
        error;
      }
    }
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

        setFormData({
          nombre: data.nombre,
          nif: data.nif,
          email: data.email,
          telefono: data.telefono,
        });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error("Usa un email válido");
          return;
        }

        const token = localStorage.getItem("token");
        const backendURL = import.meta.env.VITE_API_HOST;
        const res = await fetch(`${backendURL}/usuarios/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error("El formulario contiene algún error");
          throw new Error(data.mensaje || "Error al actualizar usuario");
        } else {
          toast.success("Perfil guardado con éxito");
          navigate("/perfil");
        }
      }

      if (fileImagenBanner) {
        const token = localStorage.getItem("token");
        const backendURL = import.meta.env.VITE_API_HOST;
        const formData = new FormData();
        formData.append("foto", fileImagenBanner);
        const res = await fetch(
          `${backendURL}/fotos/${user.establecimiento_id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.mensaje || "Error al actualizar imagen");
      }

      if (fileImagenPerfil) {
        const token = localStorage.getItem("token");
        const backendURL = import.meta.env.VITE_API_HOST;

        const formData = new FormData();
        formData.append("foto", fileImagenPerfil);

        const res = await fetch(`${backendURL}/fotos/${user.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.mensaje || "Error al actualizar imagen");
      }
    } catch (error) {
      toast.error("Ocurrió un error");
      error;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow editarPerfil">
        <div className="editarPerfil__head flex flex-col gap-10">
          <h1 className="editarPerfil__head__title">Editar perfil</h1>
          {!imagenBanner ? (
            <div className="w-full">
              <button
                className="w-full"
                onClick={
                  user.rol === "administrador"
                    ? handleButtonEditBannerClick
                    : null
                }
              >
                <img
                  title="Editar imagen"
                  src={imagenBannerSrc ? imagenBannerSrc : banner}
                  alt=""
                  className="editarPerfil__head__img"
                />
              </button>
              {user.rol === "administrador" ? (
                <input
                  type="file"
                  accept="image/*"
                  name="fotoBanner"
                  id="fotoBanner"
                  className="hidden"
                  ref={imgBannerRef}
                  onChange={handleFileBannerChange}
                />
              ) : null}
            </div>
          ) : (
            <div className="w-full">
              <button
                className="w-full"
                onClick={
                  user.rol === "administrador"
                    ? handleButtonEditBannerClick
                    : null
                }
              >
                <img
                  title="Editar imagen"
                  src={
                    imagenBannerSrc
                      ? imagenBannerSrc
                      : `${import.meta.env.VITE_IMG_HOST}${imagenBanner.url}`
                  }
                  alt=""
                  className="editarPerfil__head__img"
                />
              </button>
              {user.rol === "administrador" ? (
                <input
                  type="file"
                  name="fotoBanner"
                  accept="image/*"
                  id="fotoBanner"
                  className="hidden"
                  ref={imgBannerRef}
                  onChange={handleFileBannerChange}
                />
              ) : null}
            </div>
          )}
        </div>
        <div className="editarPerfil__body flex flex-col items-center">
          {!imagenPerfil ? (
            <div>
              <button onClick={handleButtonEditPerfilClick}>
                <img
                  title="Editar imagen"
                  src={imagenPerfilSrc ? imagenPerfilSrc : preview}
                  alt=""
                  className="editarPerfil__body__img"
                />
              </button>
              <input
                type="file"
                name="fotoPerfil"
                accept="image/*"
                id="fotoPerfil"
                className="hidden"
                ref={imgPerfilRef}
                onChange={handleFilePerfilChange}
              />
            </div>
          ) : (
            <div>
              <button onClick={handleButtonEditPerfilClick}>
                <img
                  title="Editar imagen"
                  src={
                    imagenPerfilSrc
                      ? imagenPerfilSrc
                      : `${import.meta.env.VITE_IMG_HOST}${imagenPerfil.url}`
                  }
                  alt=""
                  className="editarPerfil__body__img"
                />
              </button>
              <input
                type="file"
                name="fotoPerfil"
                id="fotoPerfil"
                accept="image/*"
                className="hidden"
                ref={imgPerfilRef}
                onChange={handleFilePerfilChange}
              />
            </div>
          )}
          <div className="editarPerfil__body__formContainer">
            <FormularioEditarPerfil
              className="w-full"
              formData={formData}
              onChange={(key, value) =>
                setFormData((prevForm) => ({
                  ...prevForm,
                  [key]: value,
                }))
              }
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
