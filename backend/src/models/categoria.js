import mongoose from "mongoose";

//Esquema Fotos
const categoriaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: {
      type: String,
    },
    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
    },
    creado_en: { type: Date, default: Date.now },
  },
  {
    collection: "Categorias",
  }
);

export default mongoose.model("Categorias", categoriaSchema);
