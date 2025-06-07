import { useNavigate } from "react-router-dom";
import React from "react";
import { Link } from "react-router-dom";
import preview from "/src/assets/images/preview.jpg";

export default function ListaCategorias({
  categorias,
  seleccionarElemento,
  modoEliminar,
  modoEditar,
  onCategoriaClick,
}) {
  const navigate = useNavigate();

  return (
    <div className="productsContainer grid grid-cols-4 gap-x-14 gap-y-10">
      {categorias.length === 0 ? (
        <p>No hay categorías creadas.</p>
      ) : (
        categorias.map((categoria) => (
          <Link
            to={`/administrar-categoria/${categoria._id}`}
            key={categoria._id}
            onClick={(e) => {
              if (modoEliminar) {
                seleccionarElemento(categoria, e);
              } else if (modoEditar) {
                e.preventDefault();
                navigate(`/administrar-categoria/${categoria._id}/edit`);
              } else if (onCategoriaClick) {
                e.preventDefault();
                onCategoriaClick(categoria);
              }
            }}
          >
            <div className="rounded-[27px] flex flex-col p-3 producto">
              {!categoria.fotos ||
              categoria.fotos.length === 0 ||
              !categoria.fotos[0]?.url ? (
                <img src={preview} className="rounded-[20px]" alt="" />
              ) : (
                <img
                  src={
                    `${import.meta.env.VITE_IMG_HOST}` + categoria.fotos[0]?.url
                  }
                  className="rounded-[20px]"
                  alt=""
                />
              )}
              <h2>{categoria.nombre}</h2>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
