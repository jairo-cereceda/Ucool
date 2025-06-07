import mongoose from "mongoose";

//Esquema Establecimiento
const establecimientoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    direccion: { type: String, trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    telefono: { type: String, trim: true },
    cif: { type: String, uppercase: true, trim: true },
    observaciones: { type: String },
    creado_en: { type: Date, default: Date.now },
  },
  {
    collection: "Establecimientos",
  }
);

export default mongoose.model("Establecimiento", establecimientoSchema);
