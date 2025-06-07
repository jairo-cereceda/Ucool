import React from "react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { MdOutlineSettings } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaRegCopyright } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { GoHomeFill } from "react-icons/go";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  const menuRef = useRef(null);

  const [isMenuHidden, setIsMenuHidden] = useState(true);

  const toggleMenu = () => {
    setIsMenuHidden(!isMenuHidden);
  };
  return (
    <header className="header">
      <nav className="flex place-content-between header__container items-center">
        <div className="flex flex-end items-center gap-5">
          <button
            onClick={toggleMenu}
            className={
              isMenuHidden
                ? "header__container__toggle"
                : "header__container__toggle menu-icon-activo"
            }
          >
            <IoMenu />
          </button>
          <Link to="/" className="header__container__left__home">
            <GoHomeFill />
          </Link>
        </div>

        <div className="flex gap-8 header__container__left items-center ">
          <Link
            to="/configuracion"
            className="header__container__left__settings"
          >
            <MdOutlineSettings />
          </Link>
          <Link to="/perfil" className="header__container__left__profile">
            <CgProfile />
          </Link>
        </div>
      </nav>

      <nav
        id="header-menu"
        ref={menuRef}
        className={
          isMenuHidden
            ? "header__menu flex flex-col justify-between header-menu-oculto"
            : "header__menu flex flex-col justify-between"
        }
      >
        <div className="header__menu__group">
          {user.rol === "administrador" ? (
            <Link
              to="/metricas"
              className="header__menu__group__metricas flex gap-10 items-center"
            >
              <IoMdTrendingUp /> Métricas
            </Link>
          ) : null}

          <Link
            to="/ayuda"
            className="header__menu__group__ayuda flex gap-10 items-center"
          >
            <IoIosHelpCircleOutline /> Ayuda
          </Link>
        </div>

        <p className="header__menu__copy flex items-center justify-center gap-1">
          <FaRegCopyright className="header__menu__copy__icon" /> 2025. Ucool,
          todos los derechos reservados
        </p>
      </nav>
    </header>
  );
}
