import sendEmail from "../services/emailSender.js";

export const enviarEmailContacto = async (req, res) => {
  const emailBody = req.body;

  const emailEnviado = await sendEmail({
    email: "mmjrz451@gmail.com",
    subject: emailBody.nombre + " - " + emailBody.asunto,
    message: emailBody.contenido + " - " + "enviado por " + emailBody.email,
  });

  if (!emailEnviado) {
    res.status(500).json({ error: "Error al enviar el correo" });
    console.warn("No se pudo enviar el correo.");
  } else {
    res.status(200).json({ message: "Correo enviado con éxito" });
  }
};
