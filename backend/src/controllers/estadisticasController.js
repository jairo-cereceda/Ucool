import establecimiento from "../models/establecimiento.js";
import {
  Venta,
  Compra,
  GastoOperativo,
  Producto,
  DetalleVenta,
} from "../models/models.js";

export const obtenerIngresosMesActual = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

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

    const pipeline = [
      //Para filtrar las ventas por fecha
      {
        $match: {
          estado: "pagado",
          establecimiento_id: req.user.establecimiento_id,
          creado_en: {
            $gte: inicioMes,
            $lte: finMes,
          },
        },
      },
      {
        //Agrupamos y sumamos los totales
        $group: {
          _id: null,
          ingresosTotalesMes: { $sum: "$total" },
          numeroDeVentas: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          ingresosTotalesMes: {
            $ifNull: [{ $toString: "$ingresosTotalesMes" }, "0.00"],
          },
          numeroDeVentas: {
            $ifNull: ["$numeroDeVentas", 0],
          },
        },
      },
    ];

    const resultado = await Venta.aggregate(pipeline);

    if (resultado.length > 0) {
      res.json(resultado[0]);
    } else {
      res.json({ ingresosTotalesMes: "0.00", numeroDeVentas: 0 });
    }
  } catch (error) {
    console.error("Error al calcular ingresos del mes:", error);
    res.status(500).json({
      mensaje: "Error al procesar la consulta de ingresos",
      error: error.message,
    });
  }
};

export const obtenerIngresosMesAnterior = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const fechaActual = new Date();
    const inicioMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() - 1,
      1
    );
    const finMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    const pipeline = [
      //Para filtrar las ventas por fecha
      {
        $match: {
          estado: "pagado",
          establecimiento_id: req.user.establecimiento_id,
          creado_en: {
            $gte: inicioMes,
            $lte: finMes,
          },
        },
      },
      {
        //Agrupamos y sumamos los totales
        $group: {
          _id: null,
          ingresosTotalesMes: { $sum: "$total" },
          numeroDeVentas: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          ingresosTotalesMes: {
            $ifNull: [{ $toString: "$ingresosTotalesMes" }, "0.00"],
          },
          numeroDeVentas: {
            $ifNull: ["$numeroDeVentas", 0],
          },
        },
      },
    ];

    const resultado = await Venta.aggregate(pipeline);

    if (resultado.length > 0) {
      res.json(resultado[0]);
    } else {
      res.json({ ingresosTotalesMes: "0.00", numeroDeVentas: 0 });
    }
  } catch (error) {
    console.error("Error al calcular ingresos del mes:", error);
    res.status(500).json({
      mensaje: "Error al procesar la consulta de ingresos",
      error: error.message,
    });
  }
};

export const obtenerGastosMesActual = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

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

    const pipelineCompras = [
      //Para filtrar las compras por fecha
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
          creado_en: {
            $gte: inicioMes,
            $lte: finMes,
          },
        },
      },
      {
        //Agrupamos y sumamos los totales
        $group: {
          _id: null,
          comprasTotalesMes: { $sum: "$precio_compra_total" },
          numeroDeCompras: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          comprasTotalesMes: {
            $ifNull: [{ $toString: "$comprasTotalesMes" }, "0.00"],
          },
          numeroDeCompras: {
            $ifNull: ["$numeroDeCompras", 0],
          },
        },
      },
    ];

    const pipelineGastos = [
      //Para filtrar las compras por fecha
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
          fecha_gasto: {
            $gte: inicioMes,
            $lte: finMes,
          },
        },
      },
      {
        //Agrupamos y sumamos los totales
        $group: {
          _id: null,
          gastosTotalesMes: { $sum: "$monto_gasto" },
          numeroDeGastos: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gastosTotalesMes: {
            $ifNull: [{ $toString: "$gastosTotalesMes" }, "0.00"],
          },
          numeroDeGastos: {
            $ifNull: ["$numeroDeGastos", 0],
          },
        },
      },
    ];

    const resultadoCompras = await Compra.aggregate(pipelineCompras);
    const resultadoGastos = await GastoOperativo.aggregate(pipelineGastos);

    const totalCompraStr = resultadoCompras[0]?.comprasTotalesMes || "0.00";
    const totalGastosOpStr = resultadoGastos[0]?.gastosTotalesMes || "0.00";

    const numCompras = resultadoCompras[0]?.numeroDeCompras || 0;
    const numGastosOp = resultadoGastos[0]?.numeroDeGastos || 0;

    const sumaGastosTotales =
      parseFloat(totalCompraStr) + parseFloat(totalGastosOpStr);

    res.json({
      gastosGeneralesMes: sumaGastosTotales.toFixed(2),
      detalle: {
        compras: {
          total: totalCompraStr,
          cantidad: numCompras,
        },
        gastosOperativos: {
          total: totalGastosOpStr,
          cantidad: numGastosOp,
        },
      },
    });
  } catch (error) {
    console.error("Error al calcular gastos del mes:", error);
    res.status(500).json({
      mensaje: "Error al procesar la consulta de gastos",
      error: error.message,
    });
  }
};

export const obtenerGastosMesAnterior = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const fechaActual = new Date();
    const inicioMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() - 1,
      1
    );
    const finMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    const pipelineCompras = [
      //Para filtrar las compras por fecha
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
          creado_en: {
            $gte: inicioMes,
            $lte: finMes,
          },
        },
      },
      {
        //Agrupamos y sumamos los totales
        $group: {
          _id: null,
          comprasTotalesMes: { $sum: "$precio_compra_total" },
          numeroDeCompras: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          comprasTotalesMes: {
            $ifNull: [{ $toString: "$comprasTotalesMes" }, "0.00"],
          },
          numeroDeCompras: {
            $ifNull: ["$numeroDeCompras", 0],
          },
        },
      },
    ];

    const pipelineGastos = [
      //Para filtrar las compras por fecha
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
          fecha_gasto: {
            $gte: inicioMes,
            $lte: finMes,
          },
        },
      },
      {
        //Agrupamos y sumamos los totales
        $group: {
          _id: null,
          gastosTotalesMes: { $sum: "$monto_gasto" },
          numeroDeGastos: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gastosTotalesMes: {
            $ifNull: [{ $toString: "$gastosTotalesMes" }, "0.00"],
          },
          numeroDeGastos: {
            $ifNull: ["$numeroDeGastos", 0],
          },
        },
      },
    ];

    const resultadoCompras = await Compra.aggregate(pipelineCompras);
    const resultadoGastos = await GastoOperativo.aggregate(pipelineGastos);

    const totalCompraStr = resultadoCompras[0]?.comprasTotalesMes || "0.00";
    const totalGastosOpStr = resultadoGastos[0]?.gastosTotalesMes || "0.00";

    const numCompras = resultadoCompras[0]?.numeroDeCompras || 0;
    const numGastosOp = resultadoGastos[0]?.numeroDeGastos || 0;

    const sumaGastosTotales =
      parseFloat(totalCompraStr) + parseFloat(totalGastosOpStr);

    res.json({
      gastosGeneralesMes: sumaGastosTotales.toFixed(2),
      detalle: {
        compras: {
          total: totalCompraStr,
          cantidad: numCompras,
        },
        gastosOperativos: {
          total: totalGastosOpStr,
          cantidad: numGastosOp,
        },
      },
    });
  } catch (error) {
    console.error("Error al calcular gastos del mes anterior:", error);
    res.status(500).json({
      mensaje: "Error al procesar la consulta de gastos anteriores",
      error: error.message,
    });
  }
};

export const obtenerProductoMasVendido = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const pipeline = [
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
        },
      },
      {
        //Agrupamos y sumamos las cantidades
        $group: {
          _id: "$producto_id",
          cantidadTotal: { $sum: "$cantidad" },
        },
      },
      {
        $sort: {
          cantidadTotal: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "Productos",
          localField: "_id",
          foreignField: "_id",
          as: "infoProducto",
        },
      },
      {
        $unwind: {
          path: "$infoProducto",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          producto_id: "$_id",
          nombreProducto: "$infoProducto.nombre",
          skuProducto: "$infoProducto.sku",
          cantidadTotal: 1,
        },
      },
    ];

    const resultado = await DetalleVenta.aggregate(pipeline);

    if (resultado.length > 0) {
      res.json(resultado[0]);
    } else {
      res.status(404).json({
        mensaje: "No se encontraron detalles de venta para analizar.",
      });
    }
  } catch (error) {
    console.error(
      "Error al obtener el producto más vendido en detalles:",
      error
    );
    res.status(500).json({
      mensaje: "Error al procesar la consulta",
      error: error.message,
    });
  }
};

export const obtenerProductoMenosVendido = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const pipeline = [
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
        },
      },
      {
        $lookup: {
          from: "Detalle_venta",
          localField: "_id",
          foreignField: "producto_id",
          as: "detalleProducto",
        },
      },
      {
        $unwind: {
          path: "$detalleProducto",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          nombreProducto: { $first: "$nombre" },
          skuProducto: { $first: "$sku" },
          cantidadTotal: { $sum: "$detalleProducto.cantidad" },
        },
      },
      {
        $sort: {
          cantidadTotal: 1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          producto_id: "$_id",
          nombreProducto: 1,
          skuProducto: 1,
          cantidadTotal: { $ifNull: ["$cantidadTotal", 0] },
        },
      },
    ];

    const resultado = await Producto.aggregate(pipeline);

    if (resultado.length > 0) {
      res.json(resultado[0]);
    } else {
      res.status(404).json({
        mensaje: "No se encontraron detalles de venta para analizar.",
      });
    }
  } catch (error) {
    console.error(
      "Error al obtener el producto menos vendido en detalles:",
      error
    );
    res.status(500).json({
      mensaje: "Error al procesar la consulta",
      error: error.message,
    });
  }
};

export const obtenerProductoMayorIngreso = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const pipeline = [
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
        },
      },
      {
        //Agrupamos y sumamos los subtotales
        $group: {
          _id: "$producto_id",
          ingresoTotal: { $sum: "$subtotal" },
        },
      },
      {
        $sort: {
          ingresoTotal: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "Productos",
          localField: "_id",
          foreignField: "_id",
          as: "infoProducto",
        },
      },
      {
        $unwind: {
          path: "$infoProducto",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          producto_id: "$_id",
          nombreProducto: "$infoProducto.nombre",
          ingresoTotal: 1,
        },
      },
    ];

    const resultado = await DetalleVenta.aggregate(pipeline);

    if (resultado.length > 0) {
      res.json(resultado[0]);
    } else {
      res.status(404).json({
        mensaje: "No se encontraron detalles de venta para analizar.",
      });
    }
  } catch (error) {
    console.error("Error al obtener el producto en detalles:", error);
    res.status(500).json({
      mensaje: "Error al procesar la consulta",
      error: error.message,
    });
  }
};

//Añadir movidas de si no se ha vendido nunca

export const obtenerProductoMenorIngreso = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const pipeline = [
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
        },
      },
      {
        $lookup: {
          from: "Detalle_venta",
          localField: "_id",
          foreignField: "producto_id",
          as: "detalleProducto",
        },
      },
      {
        $unwind: {
          path: "$detalleProducto",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          nombreProducto: { $first: "$nombre" },
          skuProducto: { $first: "$sku" },
          ingresoTotal: { $sum: "$detalleProducto.subtotal" },
        },
      },
      {
        $sort: {
          ingresoTotal: 1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          producto_id: "$_id",
          nombreProducto: 1,
          skuProducto: 1,
          ingresoTotal: { $ifNull: ["$ingresoTotal", 0] },
        },
      },
    ];

    const resultado = await Producto.aggregate(pipeline);

    if (resultado.length > 0) {
      res.json(resultado[0]);
    } else {
      res.status(404).json({
        mensaje: "No se encontraron detalles de venta para analizar.",
      });
    }
  } catch (error) {
    console.error(
      "Error al obtener el producto menos vendido en detalles:",
      error
    );
    res.status(500).json({
      mensaje: "Error al procesar la consulta",
      error: error.message,
    });
  }
};

//Producto que mayor y menor margen de beneficio
export const obtenerProductoMayorMargenBeneficio = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }
    const pipeline = [
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
        },
      },
      {
        $lookup: {
          from: "Compras",
          let: { productoIdActual: "$_id" },
          pipeline: [
            {
              $match: {
                establecimiento_id: req.user.establecimiento_id,
                $expr: { $eq: ["$producto_id", "$$productoIdActual"] },
              },
            },
            {
              $sort: { creado_en: -1 },
            },
            {
              $limit: 1,
            },
            {
              $project: { _id: 0, precio_compra_unitario: 1 },
            },
          ],
          as: "ultimaCompraInfo",
        },
      },
      {
        $unwind: {
          path: "$ultimaCompraInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          costoCompraReciente: {
            $ifNull: [
              "$ultimaCompraInfo.precio_compra_unitario",
              "$precio_compra",
            ],
          },
          margenUnitario: {
            $subtract: ["$precio_venta", "$costoCompraReciente"],
          },
        },
      },
      {
        $sort: {
          margenUnitario: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          producto_id: "$_id",
          nombre: 1,
          sku: 1,
          precio_venta_actual: {
            $ifNull: [{ $toString: "$precio_venta" }, "0.00"],
          },
          costo_compra_reciente: {
            $ifNull: [{ $toString: "$costoCompraReciente" }, "0.00"],
          },
          margen_unitario_actual: {
            $ifNull: [{ $toString: "$margenUnitario" }, "0.00"],
          },
        },
      },
    ];

    const resultado = await Producto.aggregate(pipeline);

    if (resultado.length > 0) {
      res.json(resultado[0]);
    } else {
      res.status(404).json({
        mensaje:
          "No se encontraron productos para analizar o no tienen información de compra/venta.",
      });
    }
  } catch (error) {
    console.error(
      "Error al obtener el producto con mayor margen unitario actual",
      error
    );
    res.status(500).json({
      mensaje: "Error al procesar la consulta",
      error: error.message,
    });
  }
};

export const obtenerProductoMenorMargenBeneficio = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const pipeline = [
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
        },
      },
      {
        $lookup: {
          from: "Compras",
          let: { productoIdActual: "$_id" },
          pipeline: [
            {
              $match: {
                establecimiento_id: req.user.establecimiento_id,
                $expr: { $eq: ["$producto_id", "$$productoIdActual"] },
              },
            },
            {
              $sort: { creado_en: -1 },
            },
            {
              $limit: 1,
            },
            {
              $project: { _id: 0, precio_compra_unitario: 1 },
            },
          ],
          as: "ultimaCompraInfo",
        },
      },
      {
        $unwind: {
          path: "$ultimaCompraInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          costoCompraReciente: {
            $ifNull: [
              "$ultimaCompraInfo.precio_compra_unitario",
              "$precio_compra",
            ],
          },
          margenUnitario: {
            $subtract: ["$precio_venta", "$costoCompraReciente"],
          },
        },
      },
      {
        $sort: {
          margenUnitario: 1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          producto_id: "$_id",
          nombre: 1,
          sku: 1,
          precio_venta_actual: {
            $ifNull: [{ $toString: "$precio_venta" }, "0.00"],
          },
          costo_compra_reciente: {
            $ifNull: [{ $toString: "$costoCompraReciente" }, "0.00"],
          },
          margen_unitario_actual: {
            $ifNull: [{ $toString: "$margenUnitario" }, "0.00"],
          },
        },
      },
    ];

    const resultado = await Producto.aggregate(pipeline);

    if (resultado.length > 0) {
      res.json(resultado[0]);
    } else {
      res.status(404).json({
        mensaje:
          "No se encontraron productos para analizar o no tienen información de compra/venta.",
      });
    }
  } catch (error) {
    console.error(
      "Error al obtener el producto con mayor margen unitario actual",
      error
    );
    res.status(500).json({
      mensaje: "Error al procesar la consulta",
      error: error.message,
    });
  }
};

//Producto que mayor y menor beneficio han generado
export const obtenerProductoMayorBeneficio = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const pipeline = [
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
        },
      },
      {
        $lookup: {
          from: "Productos",
          localField: "producto_id",
          foreignField: "_id",
          as: "infoProducto",
        },
      },
      {
        $unwind: "$infoProducto",
      },
      {
        $lookup: {
          from: "Compras",
          let: {
            productoIdActual: "$producto_id",
            fechaVentaActual: "$creado_en",
          },
          pipeline: [
            {
              $match: {
                establecimiento_id: req.user.establecimiento_id,
                $expr: {
                  $and: [
                    { $eq: ["$producto_id", "$$productoIdActual"] },
                    { $lte: ["$creado_en", "$$fechaVentaActual"] },
                  ],
                },
              },
            },
            {
              $sort: { creado_en: -1 },
            },
            {
              $limit: 1,
            },
            {
              $project: { _id: 0, precio_compra_unitario: 1 },
            },
          ],
          as: "infoCostoCompraReciente",
        },
      },
      {
        $unwind: {
          path: "$infoCostoCompraReciente",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          beneficioDeEstaLinea: {
            $multiply: [
              {
                $subtract: [
                  { $toDecimal: "$precio_unitario" },
                  {
                    $toDecimal: {
                      $ifNull: [
                        "$infoCostoCompraReciente.precio_compra_unitario",
                        { $ifNull: ["$infoProducto.precio_compra", "0"] },
                      ],
                    },
                  },
                ],
              },
              { $toDecimal: "$cantidad" },
            ],
          },
        },
      },
      {
        //Agrupamos y sumamos los subtotales
        $group: {
          _id: "$producto_id",
          nombreProducto: { $first: "$infoProducto.nombre" },
          beneficioTotalAcumuladoDelProducto: { $sum: "$beneficioDeEstaLinea" },
        },
      },
      {
        $sort: {
          beneficioTotalAcumuladoDelProducto: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          producto_id: "$_id",
          nombreProducto: 1,
          beneficioTotalGenerado: {
            $ifNull: [
              { $toString: "$beneficioTotalAcumuladoDelProducto" },
              "0.00",
            ],
          },
        },
      },
    ];

    const resultado = await DetalleVenta.aggregate(pipeline);

    if (resultado.length > 0) {
      res.json(resultado[0]);
    } else {
      res.status(404).json({
        mensaje: "No se encontraron detalles de venta para analizar.",
      });
    }
  } catch (error) {
    console.error("Error al obtener el producto con mayor beneficio:", error);
    res.status(500).json({
      mensaje: "Error al procesar la consulta",
      error: error.message,
    });
  }
};

export const obtenerProductoMenorBeneficio = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const pipeline = [
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
        },
      },
      {
        $lookup: {
          from: "Detalle_venta",
          localField: "_id",
          foreignField: "producto_id",
          as: "detalleVenta",
        },
      },
      {
        $unwind: {
          path: "$detalleVenta",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Compras",
          let: {
            productoIdActual: "$detalleVenta.producto_id",
            fechaVentaActual: "$detalleVenta.creado_en",
          },
          pipeline: [
            {
              $match: {
                establecimiento_id: req.user.establecimiento_id,
                $expr: {
                  $and: [
                    { $eq: ["$producto_id", "$$productoIdActual"] },
                    { $lte: ["$creado_en", "$$fechaVentaActual"] },
                  ],
                },
              },
            },
            {
              $sort: { creado_en: -1 },
            },
            {
              $limit: 1,
            },
            {
              $project: { _id: 0, precio_compra_unitario: 1 },
            },
          ],
          as: "infoCostoCompraReciente",
        },
      },
      {
        $unwind: {
          path: "$infoCostoCompraReciente",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          beneficioDeEstaLinea: {
            $cond: {
              if: { $eq: ["$detalleVenta", null] },
              then: 0,
              else: {
                $multiply: [
                  {
                    $subtract: [
                      { $toDecimal: "$detalleVenta.precio_unitario" },
                      {
                        $toDecimal: {
                          $ifNull: [
                            "$infoCostoCompraReciente.precio_compra_unitario",
                            { $ifNull: ["$infoProducto.precio_compra", "0"] },
                          ],
                        },
                      },
                    ],
                  },
                  "$detalleVenta.cantidad",
                ],
              },
            },
          },
        },
      },
      {
        //Agrupamos y sumamos los subtotales
        $group: {
          _id: "$_id",
          nombreProducto: { $first: "$nombre" },
          beneficioTotalAcumuladoDelProducto: { $sum: "$beneficioDeEstaLinea" },
        },
      },
      {
        $sort: {
          beneficioTotalAcumuladoDelProducto: 1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          producto_id: "$_id",
          nombreProducto: 1,
          beneficioTotalGenerado: {
            $ifNull: [
              { $toString: "$beneficioTotalAcumuladoDelProducto" },
              "0.00",
            ],
          },
        },
      },
    ];

    const resultado = await Producto.aggregate(pipeline);

    if (resultado.length > 0) {
      res.json(resultado[0]);
    } else {
      res.status(404).json({
        mensaje: "No se encontraron detalles de venta para analizar.",
      });
    }
  } catch (error) {
    console.error("Error al obtener el producto con mayor beneficio:", error);
    res.status(500).json({
      mensaje: "Error al procesar la consulta",
      error: error.message,
    });
  }
};
