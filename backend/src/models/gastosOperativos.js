import mongoose from "mongoose";

//Esquema Gastos Operativos
const gastosOperativosSchema = new mongoose.Schema(
  {
    descripcion_gasto: {
      type: String,
      required: true,
    },
    categoria_gasto: {
      type: String,
    },
    monto_gasto: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },
    fecha_gasto: {
      type: Date,
      required: true,
    },
    observaciones: { type: String, trim: true },
    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
    },
    creado_en: { type: Date, default: Date.now },
  },
  {
    collection: "GastosOperativos",
  }
);

export default mongoose.model("GastosOperativos", gastosOperativosSchema);
