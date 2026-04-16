const cloudinary = require("../config/cloudinary");

/**
 * Elimina un archivo de Cloudinary
 * @param {string} publicId
 * @param {string} resourceType "image" | "video" | "raw"
 */
async function deleteFromCloudinary(publicId, resourceType = "image") {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (err) {
    console.warn("Error eliminando archivo de Cloudinary:", err.message);
  }
}

module.exports = deleteFromCloudinary;