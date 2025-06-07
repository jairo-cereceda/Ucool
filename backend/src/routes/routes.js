import clientesRoutes from "./clientesRoutes.js";
import descuentosRoutes from "./descuentosRoutes.js";
import detalleVentaRoutes from "./detalleVentaRoutes.js";
import devolucionesRoutes from "./devolucionesRoutes.js";
import establecimientoRoutes from "./establecimientoRoutes.js";
import fotoRoutes from "./fotoRoutes.js";
import productoRoutes from "./productoRoutes.js";
import proveedorRoutes from "./proveedorRoutes.js";
import tarjetasRoutes from "./tarjetaRoutes.js";
import usuariosRoutes from "./usuarioRoutes.js";
import ventasRoutes from "./ventaRoutes.js";
import estadisticasRoutes from "./estadisticasRoutes.js";
import comprasRoutes from "./comprasRoutes.js";
import gastosOperativosRoutes from "./gastosOperativosRoutes.js";
import progresoRoutes from "./progresoRoutes.js";
import categoriaRoutes from "./categoriaRoutes.js";
import authRoutes from "./authRoutes.js";
import contactoRoutes from "./contactoRoutes.js";

export default function useRoutes(app) {
  app.use("/api/clientes", clientesRoutes);
  app.use("/api/descuentos", descuentosRoutes);
  app.use("/api/detalle-venta", detalleVentaRoutes);
  app.use("/api/devoluciones", devolucionesRoutes);
  app.use("/api/establecimientos", establecimientoRoutes);
  app.use("/api/fotos", fotoRoutes);
  app.use("/api/productos", productoRoutes);
  app.use("/api/proveedores", proveedorRoutes);
  app.use("/api/tarjetas", tarjetasRoutes);
  app.use("/api/usuarios", usuariosRoutes);
  app.use("/api/ventas", ventasRoutes);
  app.use("/api/estadisticas", estadisticasRoutes);
  app.use("/api/compras", comprasRoutes);
  app.use("/api/gastosOperativos", gastosOperativosRoutes);
  app.use("/api/progreso", progresoRoutes);
  app.use("/api/categorias", categoriaRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/contacto", contactoRoutes);
}
