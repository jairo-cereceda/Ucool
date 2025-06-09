import sharp from "sharp";
import path from "path";
import fs from "fs";

const storageDir = "./uploads";
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
}

export const processImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se subió ninguna imagen" });
  }

  try {
    const filename = `${Date.now()}-${req.file.originalname.replace(
      /\s+/g,
      "-"
    )}`;
    const outputPath = path.join(storageDir, filename);

    await sharp(req.file.buffer)
      .toFormat("jpeg")
      .jpeg({ quality: 70 })
      .toFile(outputPath);

    req.savedImageFilename = filename;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la imagen" });
  }
};
