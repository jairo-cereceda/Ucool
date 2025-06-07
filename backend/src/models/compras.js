import mongoose from "mongoose";
import Producto from "./producto.js";

//Esquema Compras
const comprasSchema = new mongoose.Schema(
  {
    cantidad_comprada: { type: Number, default: 0, min: 1, required: true },
    precio_compra_unitario: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },
    precio_compra_total: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },
    numero_factura_proveedor: {
      type: String,
    },
    observaciones: { type: String, trim: true },
    fecha_compra: {
      type: Date,
      required: true,
    },
    producto_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
    },
    proveedor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proveedor",
    },
    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
    },
    creado_en: { type: Date, default: Date.now },
  },
  {
    collection: "Compras",
  }
);

export default mongoose.model("Compras", comprasSchema);

comprasSchema.post("save", async function (doc, next) {
  if (doc.producto_id && doc.cantidad_comprada > 0) {
    try {
      const productoActualizado = await mongoose
        .model("Producto")
        .findByIdAndUpdate(
          doc.producto_id,
          { $inc: { stock: doc.cantidad_comprada } },
          { new: true, runValidators: true }
        );
      if (productoActualizado) {
      } else {
        console.warn(
          `Producto con ID ${doc.producto_id} no encontrado al intentar actualizar stock para la compra ${doc._id}.`
        );
      }
    } catch (error) {
      console.error(
        `Error al actualizar stock de producto ${doc.producto_id} tras compra ${doc._id}:`,
        error
      );
    }
  }
  next();
});
