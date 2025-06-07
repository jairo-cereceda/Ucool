import React from "react";
import { FaRegCopyright } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__copy">
        <p className="footer__copy__content flex items-center justify-center gap-1">
          <FaRegCopyright className="footer__copy__content__icon" /> 2025.
          Ucool, todos los derechos reservados
        </p>
      </div>
      <div className="footer__links">
        <nav>
          <ul>
            <li>
              <a href="/login">Acceder</a>
            </li>
            <li>
              <a href="/contacto">Contacto</a>
            </li>
            <li>
              <a href="/ayuda">Ayuda</a>
            </li>
            <li>
              <a href="" target="_blank">
                Sobre Nosotros
              </a>
            </li>
            <li>
              <a href="https://x.com/" target="_blank">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/" target="_blank">
                Instagram
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
