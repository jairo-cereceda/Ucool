import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Usuario, Establecimiento, Tarjeta } from "../models/models.js";
import sendEmail from "../services/emailSender.js";

const generateToken = (user, isSubscribed) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      rol: user.rol,
      isVerified: user.isVerified,
      establecimiento_id: user.establecimiento_id,
      isSubscribed: isSubscribed,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    }
  );
};

export const registerEstablecimiento = async (req, res) => {
  try {
    const { usuario, establecimiento } = req.body;

    if (!usuario || !establecimiento) {
      return res
        .status(400)
        .json({ mensaje: "Datos de usuario o establecimiento faltantes." });
    }

    const {
      nombre: nombreUsuario,
      telefono: telefonoUsuario,
      nif: nifUsuario,
      email: emailUsuario,
      password: passwordUsuario,
      rol: rolUsuario,
    } = usuario;

    const {
      nombre: nombreEstablecimiento,
      direccion: direccionEstablecimiento,
      email: emailEstablecimiento,
      telefono: telefonoEstablecimiento,
      cif: cifEstablecimiento,
      observaciones: observacionesEstablecimiento,
    } = establecimiento;

    const userExists = await Usuario.findOne({ email: emailUsuario });
    if (userExists) {
      return res
        .status(400)
        .json({ mensaje: "El correo electrónico ya está registrado." });
    }

    const establecimientoEmailExists = await Establecimiento.findOne({
      email: emailEstablecimiento,
    });
    if (establecimientoEmailExists) {
      return res
        .status(400)
        .json({ mensaje: "Ya existe un establecimiento con ese email." });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(usuario.password)) {
      return res.status(400).json({
        mensaje:
          "La contraseña debe tener al menos 8 caracteres y contener letras y números",
      });
    }

    const nuevoEstablecimiento = new Establecimiento({
      nombre: nombreEstablecimiento,
      direccion: direccionEstablecimiento,
      email: emailEstablecimiento,
      telefono: telefonoEstablecimiento,
      cif: cifEstablecimiento,
      observaciones: observacionesEstablecimiento,
    });

    const establecimientoGuardado = await nuevoEstablecimiento.save();

    const user = await Usuario.create({
      nombre: nombreUsuario,
      telefono: telefonoUsuario,
      nif: nifUsuario,
      email: emailUsuario,
      password: passwordUsuario,
      rol: "administrador",
      establecimiento_id: establecimientoGuardado._id,
    });

    if (user) {
      const verificationToken = user.generateEmailVerificationToken();
      await user.save({ validateBeforeSave: false });

      const frontendURL = process.env.FRONTEND_URL;
      const verificationURL = `${frontendURL}/verificar-cuenta?token=${verificationToken}`;

      const message = `
        <p>Hola ${user.nombre},</p>
        <p>Gracias por registrarte. Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
        <p><a href="${verificationURL}" target="_blank">Verificar mi cuenta</a></p>
        <p>Este enlace expirará en 10 minutos.</p>
        <p>Si no te registraste en nuestra plataforma, por favor ignora este correo.</p>
      `;

      try {
        await sendEmail({
          email: user.email,
          subject: "Verificación de Cuenta",
          message,
        });

        res.status(201).json({
          mensaje:
            "Usuario registrado. Por favor, revisa tu correo para verificar tu cuenta.",
        });
      } catch (emailError) {
        console.error("Error al enviar email de verificación:", emailError);
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(500).json({
          mensaje:
            "Usuario registrado, pero ocurrió un error al enviar el correo de verificación. Por favor, intenta reenviar la verificación.",
        });
      }
    } else {
      res.status(400).json({ mensaje: "Datos de usuario inválidos." });
    }
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      mensaje: "Error en el servidor durante el registro.",
      error: error.message,
    });
  }
};

export const register = async (req, res) => {
  const { nombre, telefono, nif, email, password, rol, establecimiento_id } =
    req.body;

  try {
    const userExists = await Usuario.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ mensaje: "El correo electrónico ya está registrado." });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        mensaje:
          "La contraseña debe tener al menos 8 caracteres y contener letras y números",
      });
    }

    const user = await Usuario.create({
      nombre,
      telefono,
      nif,
      email,
      password,
      rol,
      establecimiento_id,
    });

    if (user) {
      const verificationToken = user.generateEmailVerificationToken();
      await user.save({ validateBeforeSave: false });

      const frontendURL = process.env.FRONTEND_URL;
      const verificationURL = `${frontendURL}/verificar-cuenta?token=${verificationToken}`;

      const message = `
        <p>Hola ${user.nombre},</p>
        <p>Gracias por registrarte. Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
        <p><a href="${verificationURL}" target="_blank">Verificar mi cuenta</a></p>
        <p>Este enlace expirará en 10 minutos.</p>
        <p>Si no te registraste en nuestra plataforma, por favor ignora este correo.</p>
      `;

      try {
        await sendEmail({
          email: user.email,
          subject: "Verificación de Cuenta",
          message,
        });

        res.status(201).json({
          mensaje:
            "Usuario registrado. Por favor, revisa tu correo para verificar tu cuenta.",
        });
      } catch (emailError) {
        console.error("Error al enviar email de verificación:", emailError);
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(500).json({
          mensaje:
            "Usuario registrado, pero ocurrió un error al enviar el correo de verificación. Por favor, intenta reenviar la verificación.",
        });
      }
    } else {
      res.status(400).json({ mensaje: "Datos de usuario inválidos." });
    }
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      mensaje: "Error en el servidor durante el registro.",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  try {
    const user = await Usuario.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        mensaje:
          "Token de verificación inválido o expirado. Por favor, solicita uno nuevo.",
      });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      mensaje: "Cuenta verificada exitosamente. Ahora puedes iniciar sesión.",
    });
  } catch (error) {
    console.error("Error en verificación de email:", error);
    res.status(500).json({
      mensaje: "Error en el servidor durante la verificación.",
      error: error.message,
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ mensaje: "Por favor, proporciona un correo electrónico" });
  }

  try {
    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.status(404).json({
        mensaje: "No se encontró un usuario con ese correo electrónico.",
      });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ mensaje: "Esta cuenta ya ha sido verificada." });
    }

    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const frontendURL = process.env.FRONTEND_URL;
    const verificationURL = `${frontendURL}/verificar-cuenta?token=${verificationToken}`;

    const message = `
            <p>Hola ${user.nombre},</p>
            <p>Has solicitado reenviar el correo de verificación. Por favor, haz clic en el siguiente enlace:</p>
            <p><a href="${verificationURL}" target="_blank">Verificar mi cuenta</a></p>
            <p>Este enlace expirará en 10 minutos.</p>
        `;

    await sendEmail({
      email: user.email,
      subject: "Reenviar Verificación de Cuenta",
      message,
    });

    res.status(200).json({
      mensaje:
        "Se ha reenviado el correo de verificación. Por favor, revisa tu bandeja de entrada.",
    });
  } catch (error) {
    console.error("Error al reenviar email de verificación:", error);
    res.status(500).json({
      mensaje: "Error al procesar la solicitud. Inténtalo de nuevo más tarde.",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ mensaje: "Por favor, proporciona email y contraseña." });
  }

  try {
    const user = await Usuario.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    let isUserSubscribed = false;
    if (user.establecimiento_id) {
      const tarjeta = await Tarjeta.findOne({
        establecimiento_id: user.establecimiento_id,
      });
      if (tarjeta) {
        isUserSubscribed = tarjeta.activo;
      }
    }

    const token = generateToken(user, isUserSubscribed);

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        establecimiento_id: user.establecimiento_id,
        rol: user.rol,
        isVerified: user.isVerified,
        isSubscribed: isUserSubscribed,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      mensaje: "Error en el servidor durante el inicio de sesión.",
      error: error.message,
    });
  }
};

export const enviarEmailCambiarPass = async (req, res) => {
  const user = await Usuario.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ mensaje: "Usuario no encontrado." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const frontendURL = process.env.FRONTEND_URL;
  const cambioURL = `${frontendURL}/cambiar-pass?token=${token}`;
  const message = `
        <p>Hola ${user.nombre},</p>
        <p>Entra en este enlace para cambiar la contraseña de tu cuenta:</p>
        <p><a href="${cambioURL}" target="_blank">Cambiar contraseña</a></p>
        <p>Este enlace expirará en 10 minutos.</p>
        <p>Si no solicitaste un cambio de contraseña por favor, ignora este correo.</p>
      `;
  try {
    await sendEmail({
      email: user.email,
      subject: "Cambiar contraseña de Ucool",
      message,
    });

    res.status(201).json({
      mensaje: "Email de cambio de contraseña enviado.",
    });
  } catch (emailError) {
    console.error("Error al enviar email de verificación:", emailError);
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      mensaje:
        "Usuario registrado, pero ocurrió un error al enviar el correo de verificación. Por favor, intenta reenviar la verificación.",
    });
  }
};

export const actualizarPass = async (req, res) => {
  const { token } = req.params;
  const { newPass } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await Usuario.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        mensaje:
          "Token de cambio de contraseña. Por favor, solicita uno nuevo.",
      });
    }

    user.password = newPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      mensaje: "Contraseña actualizada.",
    });
  } catch (error) {
    console.error("Error en verificación de email:", error);
    res.status(500).json({
      mensaje: "Error en el servidor durante la verificación.",
      error: error.message,
    });
  }
};
