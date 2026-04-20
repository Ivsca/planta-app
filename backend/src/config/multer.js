// backend/src/config/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");

// Ruta absoluta a la carpeta uploads (backend/uploads/)
const uploadPath = path.join(__dirname, "..", "..", "uploads");


// Crear la carpeta si no existe (necesario en Render y otros hosting)
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Extensión del nombre original, o fallback por MIME type
    let ext = path.extname(file.originalname);
    if (!ext) {
      const mimeExt = mime.extension(file.mimetype);
      ext = mimeExt ? `.${mimeExt}` : "";
    }
    const uniqueName = `${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// Permitir audio + image o video

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio/") ||file.mimetype.startsWith("image/") ||file.mimetype.startsWith("video/") ) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos de audio, imagen o video"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB; ajusta si tu audio lo requiere
  fileFilter,
});

module.exports = upload;