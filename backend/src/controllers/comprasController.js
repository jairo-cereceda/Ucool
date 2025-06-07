import { Compra } from "../models/models.js";
import mongoose from "mongoose";

//Obtener todas las compras
export const obtenerCompras = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const compras = await Compra.find({
      establecimiento_id: req.user.establecimiento_id,
    });

    res.json(compras);
  } catch (error) {
    console.error("Error al obtener compras:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener compras", error: error.message });
  }
};

export const getCompra = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID no válido" });
    }

    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const compra = await Compra.findById(objectId);

    if (!compra) {
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }

    res.json(compra);
  } catch (error) {
    console.error("Error en getProducto:", error);
    res.status(500).json({ mensaje: "Error al obtener producto", error });
  }
};

//Crear una compra
export const crearCompras = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const parsedCompra = JSON.parse(req.body.compra);

    const {
      cantidad_comprada,
      precio_compra_unitario,
      precio_compra_total,
      numero_factura_proveedor,
      observaciones,
      producto_id,
      proveedor_id,
      fecha_compra,
    } = parsedCompra;

    const nuevaCompra = new Compra({
      cantidad_comprada,
      precio_compra_unitario,
      precio_compra_total,
      numero_factura_proveedor,
      observaciones,
      producto_id,
      proveedor_id,
      fecha_compra,
      establecimiento_id: req.user.establecimiento_id,
    });

    const compraGuardada = await nuevaCompra.save();
    res.status(201).json(compraGuardada);
  } catch (error) {
    console.error("Error al crear compra:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ mensaje: "Error de validación", errores: error.errors });
    }
    res.status(500).json({
      mensaje: "Error del servidor al crear compra.",
      error: error.message,
    });
  }
};

//Actualizar una compra
export const actualizarCompra = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    let compraData;

    try {
      compraData = JSON.parse(req.body.compra);
    } catch (error) {
      return res.status(400).json({ mensaje: "Formato de compra inválido" });
    }

    const compra = await Compra.findById(req.params.id);

    if (!compra) {
      return res.status(404).json({ mensaje: "Compra no encontrada." });
    }

    if (
      compra.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para modificar esta compra." });
    }

    Object.assign(compra, compraData);
    const compraActualizada = await compra.save();

    res.json(compraActualizada);
  } catch (error) {
    console.error("Error al actualizar compra:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación al actualizar",
        errores: error.errors,
      });
    }
    res
      .status(500)
      .json({ mensaje: "Error al actualizar compra", error: error.message });
  }
};

//Eliminar una compra
export const eliminarCompra = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const compra = await Compra.findById(req.params.id);

    if (!compra) {
      return res.status(404).json({ mensaje: "Compra no encontrada." });
    }

    if (
      compra.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para eliminar esta compra." });
    }

    await compra.deleteOne();
    res.json({ mensaje: "Compra eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar compra:", error);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar compra", error: error.message });
  }
};
