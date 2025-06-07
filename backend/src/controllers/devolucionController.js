import { Devolucion } from "../models/models.js";

//Obtener todas los devoluciones
export const obtenerDevoluciones = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const devoluciones = await Devolucion.find({
      establecimiento_id: req.user.establecimiento_id,
    });

    res.json(devoluciones);
  } catch (error) {
    console.error("Error al obtener devolucion:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener devolucion", error: error.message });
  }
};

//Crear una devolucion
export const crearDevolucion = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const parsedDevolucion = JSON.parse(req.body.devolucion);

    const { total_devuelto, metodo_reembolso, observaciones, venta_id } =
      parsedDevolucion;

    const nuevaDevolucion = new Devolucion({
      total_devuelto,
      metodo_reembolso,
      observaciones,
      venta_id,
      establecimiento_id: req.user.establecimiento_id,
    });

    const devolucionGuardada = await nuevaDevolucion.save();
    res.status(201).json(devolucionGuardada);
  } catch (error) {
    console.error("Error al crear devolucion:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ mensaje: "Error de validación", errores: error.errors });
    }
    res.status(500).json({
      mensaje: "Error del servidor al crear devolucion.",
      error: error.message,
    });
  }
};

//Actualizar una devolucion
export const actualizarDevolucion = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }
    const devolucion = await Devolucion.findById(req.params.id);

    if (!devolucion) {
      return res.status(404).json({ mensaje: "Devolucion no encontrada." });
    }

    if (
      devolucion.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para modificar esta Devolucion." });
    }

    Object.assign(devolucion, req.body);
    const devolucionActualizada = await devolucion.save();

    res.json(devolucionActualizada);
  } catch (error) {
    console.error("Error al actualizar Devolucion:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación al actualizar",
        errores: error.errors,
      });
    }
    res.status(500).json({
      mensaje: "Error al actualizar Devolucion",
      error: error.message,
    });
  }
};

//Eliminar una devolucion
export const eliminarDevolucion = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const devolucion = await Devolucion.findById(req.params.id);

    if (!devolucion) {
      return res.status(404).json({ mensaje: "devolucion no encontrado." });
    }

    if (
      devolucion.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para eliminar esta devolucion." });
    }

    await devolucion.deleteOne();
    res.json({ mensaje: "Devolucion eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar devolucion:", error);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar devolucion", error: error.message });
  }
};
