import mongoose from "mongoose";
import Cliente from "./cliente.js";

//Esquema Ventas
const ventaSchema = new mongoose.Schema(
  {
    metodo_pago: {
      type: String,
      required: true,
      enum: ["efectivo", "tarjeta", "cupon"],
    },
    observaciones: { type: String, trim: true },
    total: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0 },
    estado: {
      type: String,
      required: true,
      enum: ["pendiente", "pagado", "cancelado", "reembolsado"],
      default: "pendiente",
    },
    url_ticket: { type: String, trim: true },
    cliente_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
    },
    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
    },
    creado_en: { type: Date, default: Date.now },
  },
  {
    collection: "Ventas",
  }
);

//Trigger
ventaSchema.post("save", async function (doc, next) {
  if (doc.estado === "pagado" && doc.cliente_id) {
    try {
      const totalVenta = parseFloat(doc.total.toString());
      const puntosGanados = Math.floor(totalVenta / 10);

      if (puntosGanados > 0) {
        await Cliente.findByIdAndUpdate(doc.cliente_id, {
          $inc: { puntos: puntosGanados },
        });
      }
    } catch (error) {
      console.error(
        `Error al actualizarpuntos para cliente ${doc.cliente_id} tras venta ${doc._id}:`,
        error
      );
    }
  }
  next();
});

export default mongoose.model("Venta", ventaSchema);
