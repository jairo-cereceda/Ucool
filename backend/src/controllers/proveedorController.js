import { Proveedor } from "../models/models.js";
import mongoose from "mongoose";

//Obtener todas los devoluciones
export const obtenerProveedores = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const proveedores = await Proveedor.find({
      establecimiento_id: req.user.establecimiento_id,
    });

    res.json(proveedores);
  } catch (error) {
    console.error("Error al obtener proveedor:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener proveedor", error: error.message });
  }
};

export const getProveedor = async (req, res) => {
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

    const proveedor = await Proveedor.findOne({
      _id: id,
      establecimiento_id: req.user.establecimiento_id,
    });

    if (proveedor.length === 0) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }

    res.json(proveedor);
  } catch (error) {
    console.error("Error al obtener proveedor:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener proveedor", error: error.message });
  }
};

//Crear una devolucion
export const crearProveedor = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const parsedProveedor = JSON.parse(req.body.proveedor);
    const { nombre, telefono, email, direccion, cif } = parsedProveedor;

    const nuevoProveedor = new Proveedor({
      nombre,
      telefono,
      email,
      direccion,
      cif,
      establecimiento_id: req.user.establecimiento_id,
    });

    const proveedorGuardado = await nuevoProveedor.save();
    res.status(201).json(proveedorGuardado);
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ mensaje: "Error de validación", errores: error.errors });
    }
    res.status(500).json({
      mensaje: "Error del servidor al crear proveedor.",
      error: error.message,
    });
  }
};

//Actualizar una devolucion
export const actualizarProveedor = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    let proveedorData;

    try {
      proveedorData = JSON.parse(req.body.proveedor);
    } catch (error) {
      return res.status(400).json({ mensaje: "Formato de proveedor inválido" });
    }

    const proveedor = await Proveedor.findById(req.params.id);

    if (!proveedor) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado." });
    }

    if (
      proveedor.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para modificar este proveedor.",
      });
    }

    Object.assign(proveedor, proveedorData);
    const proveedorActualizado = await proveedor.save();

    res.json(proveedorActualizado);
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación al actualizar",
        errores: error.errors,
      });
    }
    res.status(500).json({
      mensaje: "Error al actualizar proveedor",
      error: error.message,
    });
  }
};

//Eliminar una devolucion
export const eliminarProveedor = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const proveedor = await Proveedor.findById(req.params.id);

    if (!proveedor) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado." });
    }

    if (
      proveedor.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para eliminar este proveedor.",
      });
    }

    await proveedor.deleteOne();
    res.json({ mensaje: "Proveedor eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    res.status(500).json({
      mensaje: "Error al eliminar proveedor",
      error: error.message,
    });
  }
};
