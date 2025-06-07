import mongoose from "mongoose";

//Esquema Productos
const progresoSchema = new mongoose.Schema(
  {
    beneficios: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },
    creado_en: { type: Date, default: Date.now },
    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
    },
  },
  {
    collection: "Progreso",
  }
);

export default mongoose.model("Progreso", progresoSchema);
