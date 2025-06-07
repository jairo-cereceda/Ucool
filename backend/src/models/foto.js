import mongoose from "mongoose";

//Esquema Fotos
const fotosSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    tipo: {
      type: String,
      required: true,
      enum: ["usuario", "producto", "categoria", "establecimiento"],
    },
    creado_en: { type: Date, default: Date.now },
    id_relacion: { type: mongoose.Schema.Types.ObjectId },
  },
  {
    collection: "Fotos",
  }
);

export default mongoose.model("Foto", fotosSchema);
