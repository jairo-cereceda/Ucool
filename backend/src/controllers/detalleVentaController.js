import { DetalleVenta } from "../models/models.js";

//Obtener todos los detalles
export const obtenerDetalles = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const detalles = await DetalleVenta.find({
      establecimiento_id: req.user.establecimiento_id,
    });

    res.json(detalles);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener detalles", error });
  }
};

//Crear un detalle
export const crearDetalle = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const { cantidad, precio_unitario, subtotal, venta_id, producto_id } =
      req.body;

    const nuevoDetalle = new DetalleVenta({
      cantidad,
      precio_unitario,
      subtotal,
      venta_id,
      producto_id,
      establecimiento_id: req.user.establecimiento_id,
    });

    const detalleGuardado = await nuevoDetalle.save();
    res.status(201).json(detalleGuardado);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ mensaje: "Error de validación", errores: error.errors });
    }
    res
      .status(500)
      .json({ mensaje: "Error del servidor.", error: error.message });
  }
};

//Actualizar un detalle
export const actualizarDetalle = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }
    const detalle = await DetalleVenta.findById(req.params.id);

    if (!detalle) {
      return res.status(404).json({ mensaje: "Detalle no encontrado." });
    }

    if (
      detalle.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para modificar este detalle." });
    }

    Object.assign(detalle, req.body);
    const detalleActualizado = await detalle.save();

    res.json(detalleActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar detalle", error });
  }
};

//Eliminar un detalle
export const eliminarDetalle = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const detalle = await DetalleVenta.findById(req.params.id);

    if (!detalle) {
      return res.status(404).json({ mensaje: "Detalle no encontrado." });
    }

    if (
      detalle.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para eliminar este detalle." });
    }
    await detalle.deleteOne();
    res.json({ mensaje: "Detalle de venta eliminado exitosamente." });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar detalle", error });
  }
};
