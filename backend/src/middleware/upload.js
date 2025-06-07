import multer from "multer";
import path from "path";
import fs from "fs";

const storageDir = "./uploads";
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const upload = multer({ storage });
