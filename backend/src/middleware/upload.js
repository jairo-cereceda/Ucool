import multer from "multer";
import path from "path";
import fs from "fs";

const storageDir = "./uploads";
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
}

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Formato de imagen no permitido"), false);
    }
    cb(null, true);
  },
});
