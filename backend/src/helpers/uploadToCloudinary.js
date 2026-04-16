const cloudinary = require("../config/cloudinary");
const fs = require("fs");

/**
 * Sube un archivo a Cloudinary y elimina el archivo local.
 * @param {string} filePath - Ruta local del archivo
 * @param {string} resourceType - "video" | "image" | "auto" | "raw"
 * @param {string} folder - Carpeta en Cloudinary
 * @returns {Promise<object>} Resultado de Cloudinary
 */
async function uploadToCloudinary(filePath, resourceType = "auto", folder = "uploads") {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      folder,
      // Limitar resolución máxima (no 4K): max 1920x1080
      transformation:
        resourceType === "video"
          ? [{ width: 1920, height: 1080, crop: "limit" }]
          : undefined,
    });
    // Eliminar archivo local
    // fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    // Intentar eliminar archivo local aunque falle la subida
    try {
      // fs.unlinkSync(filePath);
    } catch (_) {}
    throw error;
  }
}

module.exports = uploadToCloudinary;
