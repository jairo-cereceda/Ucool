import {
  Progreso,
  Venta,
  Compra,
  GastoOperativo,
  Establecimiento,
} from "../models/models.js";

//Obtener todas los devoluciones
export const obtenerProgresos = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const progresos = await Progreso.find({
      establecimiento_id: req.user.establecimiento_id,
    });

    res.json(progresos);
  } catch (error) {
    console.error("Error al obtener progreso:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener progreso", error: error.message });
  }
};

//Crear una devolucion
export const crearProgreso = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const { beneficios } = req.body;

    const nuevoProgreso = new Progreso({
      beneficios,
      establecimiento_id: req.user.establecimiento_id,
    });

    const progresoGuardado = await nuevoProgreso.save();
    res.status(201).json(progresoGuardado);
  } catch (error) {
    console.error("Error al crear progreso:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ mensaje: "Error de validación", errores: error.errors });
    }
    res.status(500).json({
      mensaje: "Error del servidor al crear progreso.",
      error: error.message,
    });
  }
};

//Actualizar una devolucion
export const actualizarProgreso = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }
    const progreso = await Progreso.findById(req.params.id);

    if (!progreso) {
      return res.status(404).json({ mensaje: "Progreso no encontrado." });
    }

    if (
      progreso.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para modificar este progreso.",
      });
    }

    Object.assign(progreso, req.body);
    const progresoActualizado = await progreso.save();

    res.json(progresoActualizado);
  } catch (error) {
    console.error("Error al actualizar progreso:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación al actualizar",
        errores: error.errors,
      });
    }
    res.status(500).json({
      mensaje: "Error al actualizar progreso",
      error: error.message,
    });
  }
};

//Eliminar una devolucion
export const eliminarProgreso = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const progreso = await Progreso.findById(req.params.id);

    if (!progreso) {
      return res.status(404).json({ mensaje: "Progreso no encontrado." });
    }

    if (
      progreso.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para eliminar este progreso.",
      });
    }

    await progreso.deleteOne();
    res.json({ mensaje: "Progreso eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar progreso:", error);
    res.status(500).json({
      mensaje: "Error al eliminar progreso",
      error: error.message,
    });
  }
};

export const guardarProgresoMensual = async () => {
  try {
    const establecimientos = await Establecimiento.find();

    for (const est of establecimientos) {
      const establecimientoId = est._id;

      const fechaActual = new Date();
      const inicioMes = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        1
      );
      const finMes = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      // Obtener ingresos por establecimiento
      const ingresosData = await Venta.aggregate([
        {
          $match: {
            estado: "pagado",
            creado_en: { $gte: inicioMes, $lte: finMes },
            establecimiento_id: establecimientoId,
          },
        },
        {
          $group: {
            _id: null,
            ingresosTotalesMes: { $sum: "$total" },
          },
        },
      ]);
      const ingresos = parseFloat(ingresosData[0]?.ingresosTotalesMes || 0);

      // Gastos: compras
      const comprasData = await Compra.aggregate([
        {
          $match: {
            creado_en: { $gte: inicioMes, $lte: finMes },
            establecimiento_id: establecimientoId,
          },
        },
        {
          $group: {
            _id: null,
            comprasTotalesMes: { $sum: "$precio_compra_total" },
          },
        },
      ]);

      // Gastos: operativos
      const gastosOpData = await GastoOperativo.aggregate([
        {
          $match: {
            fecha_gasto: { $gte: inicioMes, $lte: finMes },
            establecimiento_id: establecimientoId,
          },
        },
        {
          $group: {
            _id: null,
            gastosTotalesMes: { $sum: "$monto_gasto" },
          },
        },
      ]);

      const totalCompras = parseFloat(comprasData[0]?.comprasTotalesMes || 0);
      const totalGastosOp = parseFloat(gastosOpData[0]?.gastosTotalesMes || 0);
      const gastos = totalCompras + totalGastosOp;
      const beneficios = ingresos - gastos;

      const progreso = new Progreso({
        beneficios: beneficios.toFixed(2),
        establecimiento_id: establecimientoId,
      });

      await progreso.save();
    }
  } catch (error) {
    console.error("Error al calcular progreso mensual:", error.message);
  }
};
