import mongoose from "mongoose";

//Esquema Clientes
const clientesSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    telefono: { type: String, trim: true },
    nif: { type: String, trim: true, required: true, uppercase: true },
    direccion: { type: String, trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    puntos: { type: Number, default: 0, min: 0 },
    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
    },
    creado_en: { type: Date, default: Date.now },
  },
  {
    collection: "Clientes",
  }
);

export default mongoose.model("Cliente", clientesSchema);
