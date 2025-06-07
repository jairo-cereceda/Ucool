import React from "react";
import { Link } from "react-router-dom";

export default function HomeCard({ title, img, direccion }) {
  return (
    <Link to={direccion}>
      <div className="homeCard">
        <img src={img} alt="" className="homeCard__img aspect-[568/495]" />
        <h2 className="homeCard__title">{title}</h2>
      </div>
    </Link>
  );
}
