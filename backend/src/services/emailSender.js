import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAILPORT === "465",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Ucool <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
    attachments: options.attachments || [],
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error al enviar email:", error);
    return false;
  }
};

export default sendEmail;
