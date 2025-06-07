import mongoose from "mongoose";

//Esquema Descuentos
const descuentosSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    tipo: {
      type: String,
      trim: true,
      required: true,
      enum: ["descuento", "promocion"],
    },
    valor: { type: mongoose.Schema.Types.Decimal128, min: 0 },
    condiciones: { type: String, trim: true },
    fecha_inicio: { type: Date, required: true },
    fecha_fin: { type: Date },
    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
    },
    creado_en: { type: Date, default: Date.now },
  },
  {
    collection: "Descuentos",
  }
);

export default mongoose.model("Descuento", descuentosSchema);
