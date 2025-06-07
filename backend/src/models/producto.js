import mongoose from "mongoose";

//Esquema Productos
const productosSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: String,
    sku: String,
    codigo_barras: String,
    precio_compra: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },
    precio_venta: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },
    stock: { type: Number, default: 0 },
    stock_minimo: { type: Number, default: 0 },
    categoria: String,
    activo: { type: Boolean, default: true },
    proveedor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proveedor",
    },
    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
    },
    categoria_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
    },
    creado_en: { type: Date, default: Date.now },
  },
  {
    collection: "Productos",
  }
);

export default mongoose.model("Producto", productosSchema);
