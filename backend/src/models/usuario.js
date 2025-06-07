import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

//Esquema Usuarios
const usuariosSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    telefono: { type: String, trim: true },
    nif: { type: String, trim: true, required: true, uppercase: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    password: { type: String, required: true, select: false },
    rol: { type: String, required: true, enum: ["administrador", "empleado"] },
    activo: { type: Boolean, default: true },

    isVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },

    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

    establecimiento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establecimiento",
    },
  },
  {
    timestamps: true,
    collection: "Usuarios",
  }
);

usuariosSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usuariosSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

usuariosSchema.methods.generateEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000;

  return verificationToken;
};

export default mongoose.model("Usuario", usuariosSchema);
