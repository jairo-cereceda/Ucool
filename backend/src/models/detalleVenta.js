import mongoose from "mongoose";

//Esquema Detalle_venta
const detalle_ventaSchema = new mongoose.Schema(
  {
    cantidad: {
      type: Number,
      required: true,
      min: 1,
    },
    precio_unitario: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },
    subtotal: {
      type: mongoose.Schema.Types.Decimal128,
      min: 0,
    },
    venta_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venta",
      required: true,
    },
    producto_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
    },
    creado_en: { type: Date, default: Date.now },
  },
  {
    collection: "Detalle_venta",
  }
);

//TRIGGER
detalle_ventaSchema.pre("save", function (next) {
  if (this.isModified("cantidad") || this.isModified("precio_unitario")) {
    try {
      const cantidad = parseFloat(this.cantidad);
      const precioUnitario = parseFloat(this.precio_unitario.toString());

      if (!isNaN(cantidad) && !isNaN(precioUnitario)) {
        const subtotalCalculado = cantidad * precioUnitario;

        this.subtotal = mongoose.Types.Decimal128.fromString(
          subtotalCalculado.toFixed(2)
        );
      } else {
        return next(
          new Error(
            "Cantidad o Precio Unitario inválidos para calcular subtotal."
          )
        );
      }
    } catch (error) {
      return next(new Error(`Error al calcular subtotal: ${error.message}`));
    }
  }
  next();
});

export default mongoose.model("DetalleVenta", detalle_ventaSchema);
