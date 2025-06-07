import React from "react";
import { RxCross2 } from "react-icons/rx";

export default function ModalDelete({ controlModal, onDelete }) {
  return (
    <div>
      <div className="modal-back"></div>
      <div className="modal modal-delete">
        <div className="modal__header flex justify-between items-center gap-20">
          <h2 className="modal__header__title">
            ¿Estás seguro de que quieres eliminar?
          </h2>
          <button
            className="modal__header__cross"
            onClick={() => controlModal()}
          >
            <RxCross2 />
          </button>
        </div>
        <div className="modal-delete__main">
          <button
            onClick={() => controlModal()}
            className="modal-delete__main__button"
          >
            No
          </button>
          <button
            onClick={() => {
              onDelete();
              controlModal();
            }}
            className="modal-delete__main__button"
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
}
