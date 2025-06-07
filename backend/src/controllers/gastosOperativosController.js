import { GastoOperativo } from "../models/models.js";
import mongoose from "mongoose";

//Obtener todas los devoluciones
export const obtenerGastosOperativo = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const gastoOperativo = await GastoOperativo.find({
      establecimiento_id: req.user.establecimiento_id,
    });

    res.json(gastoOperativo);
  } catch (error) {
    console.error("Error al obtener gasto:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener gasto", error: error.message });
  }
};

//Crear una devolucion
export const crearGastosOperativo = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const parsedGasto = JSON.parse(req.body.gastoOperativo);

    const {
      descripcion_gasto,
      categoria_gasto,
      monto_gasto,
      fecha_gasto,
      observaciones,
    } = parsedGasto;

    const nuevoGastoOperativo = new GastoOperativo({
      descripcion_gasto,
      categoria_gasto,
      monto_gasto,
      fecha_gasto,
      observaciones,
      establecimiento_id: req.user.establecimiento_id,
    });

    const gastoOperativoGuardado = await nuevoGastoOperativo.save();
    res.status(201).json(gastoOperativoGuardado);
  } catch (error) {
    console.error("Error al crear gasto operativo:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ mensaje: "Error de validación", errores: error.errors });
    }
    res.status(500).json({
      mensaje: "Error del servidor al crear gasto operativo.",
      error: error.message,
    });
  }
};

export const getGastoOperativo = async (req, res) => {
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

    const gasto = await GastoOperativo.findById(objectId);

    if (!gasto) {
      return res.status(404).json({ mensaje: "Gasto no encontrada" });
    }

    res.json(gasto);
  } catch (error) {
    console.error("Error en getProducto:", error);
    res.status(500).json({ mensaje: "Error al obtener producto", error });
  }
};

//Actualizar una devolucion
export const actualizarGastoOperativo = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    let gastoData;

    try {
      gastoData = JSON.parse(req.body.gastoOperativo);
    } catch (error) {
      return res.status(400).json({ mensaje: "Formato de gasto inválido" });
    }

    const gasto = await GastoOperativo.findById(req.params.id);

    if (!gasto) {
      return res.status(404).json({ mensaje: "Compra no encontrada." });
    }

    if (
      gasto.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para modificar esta gasto." });
    }

    Object.assign(gasto, gastoData);
    const gastoActualizado = await gasto.save();

    res.json(gastoActualizado);
  } catch (error) {
    console.error("Error al actualizar gasto:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación al actualizar",
        errores: error.errors,
      });
    }
    res
      .status(500)
      .json({ mensaje: "Error al actualizar gasto", error: error.message });
  }
};

//Eliminar una devolucion
export const eliminarGastosOperativo = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const gastoOperativo = await GastoOperativo.findById(req.params.id);

    if (!gastoOperativo) {
      return res
        .status(404)
        .json({ mensaje: "Gasto operativo no encontrado." });
    }

    if (
      gastoOperativo.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para eliminar este gasto operativo.",
      });
    }

    await gastoOperativo.deleteOne();
    res.json({ mensaje: "Gasto operativo eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar gasto operativo:", error);
    res.status(500).json({
      mensaje: "Error al eliminar gasto operativo",
      error: error.message,
    });
  }
};
