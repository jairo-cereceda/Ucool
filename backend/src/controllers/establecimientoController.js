import { Establecimiento, Usuario } from "../models/models.js";
import mongoose from "mongoose";

//Obtener todas los establecimiento
export const obtenerEstablecimientos = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const establecimiento = await Establecimiento.findById(
      req.user.establecimiento_id
    );

    res.json(establecimiento);
  } catch (error) {
    console.error("Error al obtener establecimiento:", error);
    res.status(500).json({
      mensaje: "Error al obtener establecimiento",
      error: error.message,
    });
  }
};

export const getEstablecimiento = async (req, res) => {
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

    const establecimiento = await Establecimiento.findById(objectId);

    if (!establecimiento) {
      return res.status(404).json({ mensaje: "Establecimiento no encontrado" });
    }

    res.json(establecimiento);
  } catch (error) {
    console.error("Error en getEstablecimiento:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener establecimiento", error });
  }
};

//Crear una devolucion
export const crearEstablecimiento = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ mensaje: "Usuario sin sesión." });
    }

    if (req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario ya asociado a un establecimiento." });
    }

    const { nombre, direccion, email, telefono, cif, observaciones } = req.body;

    const nuevoEstablecimiento = new Establecimiento({
      nombre,
      direccion,
      email,
      telefono,
      cif,
      observaciones,
    });

    const establecimientoGuardado = await nuevoEstablecimiento.save();

    if (req.user && establecimientoGuardado) {
      const usuarioActual = await Usuario.findById(req.user._id);
      if (usuarioActual) {
        usuarioActual.establecimiento_id = establecimientoGuardado._id;
        await usuarioActual.save();
      } else {
        console.warn(
          `Usuario ${req.user._id} no encontrado para actualizar establecimiento_id.`
        );
      }
    }

    res.status(201).json(establecimientoGuardado);
  } catch (error) {
    console.error("Error al crear establecimiento:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ mensaje: "Error de validación", errores: error.errors });
    }
    res.status(500).json({
      mensaje: "Error del servidor al crear establecimiento.",
      error: error.message,
    });
  }
};

//Actualizar un establecimiento
export const actualizarEstablecimiento = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }
    const establecimiento = await Establecimiento.findById(req.params.id);

    if (!establecimiento) {
      return res
        .status(404)
        .json({ mensaje: "Establecimiento no encontrado." });
    }

    if (
      establecimiento._id.toString() !== req.user.establecimiento_id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para modificar este establecimiento.",
      });
    }

    Object.assign(establecimiento, req.body);
    const establecimientoActualizado = await establecimiento.save();

    res.json(establecimientoActualizado);
  } catch (error) {
    console.error("Error al actualizar establecimiento:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación al actualizar",
        errores: error.errors,
      });
    }
    res.status(500).json({
      mensaje: "Error al actualizar establecimiento",
      error: error.message,
    });
  }
};

//Eliminar un establecimiento
export const eliminarEstablecimiento = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const establecimiento = await Establecimiento.findById(req.params.id);

    if (!establecimiento) {
      return res
        .status(404)
        .json({ mensaje: "Establecimiento no encontrado." });
    }

    if (
      establecimiento._id.toString() !== req.user.establecimiento_id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para eliminar esta establecimiento.",
      });
    }

    await establecimiento.deleteOne();

    if (req.user) {
      const usuarioActual = await Usuario.findById(req.user._id);
      if (
        usuarioActual &&
        usuarioActual.establecimiento_id &&
        usuarioActual.establecimiento_id.toString() ===
          establecimiento._id.toString()
      ) {
        usuarioActual.establecimiento_id = undefined;
        await usuarioActual.save();
      }
    }

    res.json({ mensaje: "Establecimiento eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar devolucion:", error);
    res.status(500).json({
      mensaje: "Error al eliminar establecimiento",
      error: error.message,
    });
  }
};
