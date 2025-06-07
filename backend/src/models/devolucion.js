import mongoose from "mongoose";

//Esquema Devoluciones
const devolucionSchema = new mongoose.Schema(
  {
    total_devuelto: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },
    metodo_reembolso: {
      type: String,
      required: true,
      enum: ["efectivo", "tarjeta", "cupon"],
    },
    observaciones: { type: String, trim: true },
    venta_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ventas",
      required: true,
    },
    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
    },
    creado_en: { type: Date, default: Date.now },
  },

  {
    collection: "Devoluciones",
  }
);

export default mongoose.model("Devolucion", devolucionSchema);
