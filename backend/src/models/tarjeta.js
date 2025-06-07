import mongoose from "mongoose";

//Esquema Tarjetas
const tarjetaSchema = new mongoose.Schema(
  {
    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
      required: true,
    },
    stripe_customer_id: { type: String, required: true },
    stripe_payment_method_id: { type: String, required: true },
    subscription_id: { type: String },
    activo: { type: Boolean, default: true },
    creado_en: { type: Date, default: Date.now },
  },
  {
    collection: "Tarjetas",
  }
);

export default mongoose.model("Tarjeta", tarjetaSchema);
