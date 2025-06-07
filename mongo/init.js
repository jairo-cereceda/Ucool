db = db.getSiblingDB("ucool");

if (!db.getCollectionNames().includes("Clientes")) {
  db.createCollection("Clientes");
}

if (!db.getCollectionNames().includes("Compras")) {
  db.createCollection("Compras");
}

if (!db.getCollectionNames().includes("Descuentos")) {
  db.createCollection("Descuentos");
}

if (!db.getCollectionNames().includes("Detalle_venta")) {
  db.createCollection("Detalle_venta");
}

if (!db.getCollectionNames().includes("Devoluciones")) {
  db.createCollection("Devoluciones");
}

if (!db.getCollectionNames().includes("Establecimientos")) {
  db.createCollection("Establecimientos");
}

if (!db.getCollectionNames().includes("Fotos")) {
  db.createCollection("Fotos");
}

if (!db.getCollectionNames().includes("GastosOperativos")) {
  db.createCollection("GastosOperativos");
}

if (!db.getCollectionNames().includes("Productos")) {
  db.createCollection("Productos");
}

if (!db.getCollectionNames().includes("Progreso")) {
  db.createCollection("Progreso");
}

if (!db.getCollectionNames().includes("Proveedores")) {
  db.createCollection("Proveedores");
}

if (!db.getCollectionNames().includes("Tarjetas")) {
  db.createCollection("Tarjetas");
}

if (!db.getCollectionNames().includes("Usuarios")) {
  db.createCollection("Usuarios");
}

if (!db.getCollectionNames().includes("Ventas")) {
  db.createCollection("Ventas");
}

print("Base de datos y colecciones creadas con éxito.");
