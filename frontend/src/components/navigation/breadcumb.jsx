import React from "react";
import { Link } from "react-router-dom";

export default function Breadcumb({ breadcumbs, cssClass }) {
  return (
    <nav className={`flex ${cssClass ? cssClass : Breadcumb}`}>
      {breadcumbs.map((bc, i) => (
        <div key={i} className="breadcumb__container">
          {i !== breadcumbs.length - 1 ? (
            <Link to={bc.link} className="breadcumb__container__link">
              {bc.name}
            </Link>
          ) : (
            <Link to={bc.link} className="breadcumb__container__link--last">
              {bc.name}
            </Link>
          )}

          {i !== breadcumbs.length - 1 ? <span>&gt;</span> : null}
        </div>
      ))}
    </nav>
  );
}
