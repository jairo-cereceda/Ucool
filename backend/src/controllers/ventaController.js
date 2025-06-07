import { Venta, DetalleVenta, Producto } from "../models/models.js";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import sendEmail from "../services/emailSender.js";
import mongoose from "mongoose";

//Obtener todas los ventas
export const obtenerVentas = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const ventas = await Venta.find({
      establecimiento_id: req.user.establecimiento_id,
    });

    res.json(ventas);
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener ventas", error: error.message });
  }
};

//Crear una venta
export const crearVenta = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const { metodo_pago, observaciones, total, estado, cliente_id } = req.body;

    const nuevaVenta = new Venta({
      metodo_pago,
      observaciones,
      total,
      estado,
      cliente_id,
      establecimiento_id: req.user.establecimiento_id,
    });

    const ventaGuardada = await nuevaVenta.save();
    res.status(201).json(ventaGuardada);
  } catch (error) {
    console.error("Error al crear venta:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ mensaje: "Error de validación", errores: error.errors });
    }
    res.status(500).json({
      mensaje: "Error del servidor al crear venta.",
      error: error.message,
    });
  }
};

//Actualizar una venta
export const actualizarVenta = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }
    const venta = await Venta.findById(req.params.id);

    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada." });
    }

    if (
      venta.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para modificar esta venta." });
    }

    Object.assign(venta, req.body);
    const ventaActualizada = await venta.save();

    res.json(ventaActualizada);
  } catch (error) {
    console.error("Error al actualizar venta:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación al actualizar",
        errores: error.errors,
      });
    }
    res
      .status(500)
      .json({ mensaje: "Error al actualizar venta", error: error.message });
  }
};

//Eliminar una venta
export const eliminarVenta = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const venta = await Venta.findById(req.params.id);

    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada." });
    }

    if (
      venta.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para eliminar esta venta." });
    }

    await DetalleVenta.deleteMany({
      venta_id: venta._id,
      establecimiento_id: req.user.establecimiento_id,
    });

    await venta.deleteOne();
    res.json({ mensaje: "Venta eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar venta:", error);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar venta", error: error.message });
  }
};

export const crearVentaTotal = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const { ventaData, detalles } = req.body;

    if (
      !ventaData ||
      !detalles ||
      !Array.isArray(detalles) ||
      detalles.length === 0
    ) {
      throw new Error("Datos de venta o detalles inválidos o faltantes");
    }

    const nuevaVenta = new Venta({
      ...ventaData,
      establecimiento_id: req.user.establecimiento_id,
    });
    const ventaGuardada = await nuevaVenta.save();
    const idVenta = ventaGuardada._id;

    const detallesCreadosPromises = detalles.map((detalleData) => {
      const nuevoDetalle = new DetalleVenta({
        ...detalleData,
        venta_id: idVenta,
        establecimiento_id: req.user.establecimiento_id,
      });

      return nuevoDetalle.save();
    });

    const detallesGuardados = await Promise.all(detallesCreadosPromises);

    for (const d of detalles) {
      const producto = await Producto.findById(d.producto_id);

      if (!producto) continue;

      producto.stock -= d.cantidad;

      if (producto.stock < 0) {
        producto.stock = 0; // O lanza error si deseas
      }
      producto.save();
    }

    if (ventaGuardada.estado === "pagado") {
      const totalVenta = parseFloat(ventaGuardada.total.toString());

      const detallesVenta = await DetalleVenta.find({
        venta_id: idVenta,
      }).populate("producto_id");

      const docPDF = new PDFDocument();
      const nombreArchivo = `ticket_${idVenta}.pdf`;
      const rutaCarpeta = path.join("tickets");
      const rutaCompleta = path.join(rutaCarpeta, nombreArchivo);

      if (!fs.existsSync(rutaCarpeta)) {
        fs.mkdirSync(rutaCarpeta);
      }

      docPDF.pipe(fs.createWriteStream(rutaCompleta));

      docPDF.fontSize(14).text("TICKET DE COMPRA", { align: "center" });
      docPDF.moveDown();
      docPDF.fontSize(10).text(`Venta ID: ${idVenta}`);
      docPDF.text(
        `Fecha: ${new Date(ventaGuardada.creado_en).toLocaleString()}`
      );
      docPDF.text(`Método de pago: ${ventaGuardada.metodo_pago}`);
      docPDF.moveDown();

      detallesVenta.forEach((item) => {
        const producto = item.producto_id?.nombre || "Producto";
        const cantidad = item.cantidad;
        const precio = parseFloat(item.precio_unitario.toString());
        const subtotal = parseFloat(item.subtotal.toString());
        docPDF.text(
          `${producto} x${cantidad} - ${precio.toFixed(
            2
          )}€ = $${subtotal.toFixed(2)}`
        );
      });

      docPDF.moveDown();
      docPDF.font("Helvetica-Bold").text(`TOTAL: ${totalVenta.toFixed(2)}€`, {
        align: "right",
      });

      docPDF.end();

      if (ventaData.email && ventaData.email.trim() !== "") {
        const emailEnviado = await sendEmail({
          email: ventaData.email,
          subject: "Tu ticket de compra - Ucool",
          message: `<p>Gracias por tu compra. Adjuntamos tu ticket en PDF.</p>`,
          attachments: [
            {
              filename: nombreArchivo,
              path: rutaCompleta,
              contentType: "application/pdf",
            },
          ],
        });

        if (!emailEnviado) {
          console.warn("No se pudo enviar el ticket por correo.");
        }
      }

      ventaGuardada.url_ticket = `/tickets/${nombreArchivo}`;
      await ventaGuardada.save();
    }

    res.status(201).json({
      mensaje: "Venta y detalles creados exitosamente",
      venta: ventaGuardada,
      detalles: detallesGuardados,
    });
  } catch (error) {
    console.error("Error al crear venta total:", error);
    if (
      error.name === "ValidationError" ||
      error.message.includes("inválidos o faltantes")
    ) {
      res.status(400).json({
        mensaje: "Error de validación o datos incompletos.",
        error: error.message,
      });
    } else {
      res.status(500).json({
        mensaje: "Error del servidor al crear la venta con detalles.",
        error: error.message,
      });
    }
  }
};
