import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <nav className="header__nav flex justify-between items-center">
        <a href="http://44.214.199.224/landing" className="header__nav__home">
          <img src="logo.png" alt="" className="header__nav__home__logo" />
        </a>

        <Link to="/login" className="header__nav__access">
          Acceder
        </Link>
      </nav>
    </header>
  );
}
