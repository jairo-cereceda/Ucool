import { Descuento } from "../models/models.js";

//Obtener todos los descuentos
export const obtenerDescuentos = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const descuentos = await Descuento.find({
      establecimiento_id: req.user.establecimiento_id,
    });

    res.json(descuentos);
  } catch (error) {
    console.error("Error al obtener descuentos:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener descuento", error: error.message });
  }
};

//Crear un descuento
export const crearDescuento = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }
    const { nombre, tipo, valor, condiciones, fecha_inicio, fecha_fin } =
      req.body;

    const nuevoDescuento = new Descuento({
      nombre,
      tipo,
      valor,
      condiciones,
      fecha_inicio,
      fecha_fin,
      establecimiento_id: req.user.establecimiento_id,
    });

    const descuentoGuardado = await nuevoDescuento.save();
    res.status(201).json(descuentoGuardado);
  } catch (error) {
    console.error("Error al crear descuento:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ mensaje: "Error de validación", errores: error.errors });
    }
    res.status(500).json({
      mensaje: "Error del servidor al crear descuento.",
      error: error.message,
    });
  }
};

//Actualizar un descuento
export const actualizarDescuento = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const descuento = await Descuento.findById(req.params.id);

    if (!descuento) {
      return res.status(404).json({ mensaje: "Descuento no encontrado." });
    }

    if (
      descuento.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para modificar este descuento." });
    }

    Object.assign(descuento, req.body);
    const descuentoActualizado = await descuento.save();

    res.json(descuentoActualizado);
  } catch (error) {
    console.error("Error al actualizar descuento:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación al actualizar",
        errores: error.errors,
      });
    }
    res
      .status(500)
      .json({ mensaje: "Error al actualizar descuento", error: error.message });
  }
};

//Eliminar un descuento
export const eliminarDescuento = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }
    const descuento = await Descuento.findById(req.params.id);

    if (!descuento) {
      return res.status(404).json({ mensaje: "descuento no encontrado." });
    }

    if (
      descuento.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para eliminar este descuento." });
    }

    await descuento.deleteOne();
    res.json({ mensaje: "descuento eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar descuento:", error);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar descuento", error: error.message });
  }
};
