import mongoose from "mongoose";

//Esquema Proveedores
const proveedorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    telefono: { type: String },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    direccion: { type: String },
    cif: { type: String, uppercase: true, trim: true },
    creado_en: { type: Date, default: Date.now },
    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
    },
  },
  {
    collection: "Proveedores",
  }
);

export default mongoose.model("Proveedor", proveedorSchema);
