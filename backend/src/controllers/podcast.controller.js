// backend/src/controllers/podcast.controller.js
const fs = require("fs");
const Podcast = require("../models/Podcast");
const User = require("../models/User");
const uploadToCloudinary = require("../helpers/uploadToCloudinary");
const deleteFromCloudinary = require("../helpers/deleteFromCloudinary");

// function safeUnlink(filePath) {
//   if (!filePath) return;
//   fs.unlink(filePath, (err) => {
//     if (err)
//       console.warn(
//         "No se pudo borrar archivo local:",
//         filePath,
//         err.message,
//       );
//   });
// }


function isImage(m) {
  return typeof m === "string" && m.startsWith("image/");
}


function encodeCursor(payload) {
  // payload: { t: ISOString, id: string }
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodeCursor(cursor) {
  try {
    const raw = Buffer.from(String(cursor), "base64url").toString("utf8");
    const parsed = JSON.parse(raw);

    const t = parsed?.t;
    const id = parsed?.id;

    if (typeof t !== "string" || typeof id !== "string") return null;

    const d = new Date(t);
    if (Number.isNaN(d.getTime())) return null;

    return { t, id };
  } catch {
    return null;
  }
}

// ===============================
// CREAR PODCAST (ADMIN) - multipart fields
// fields: audio (req.files.audio[0]) + image opcional (req.files.image[0])
// ===============================
exports.createPodcast = async (req, res) => {
  console.log("Received createPodcast request with body:", req.body);
  console.log("Received createPodcast request with files:", req.files);
  const title = (req.body.title || "").trim();
  const description = (req.body.description || "").trim();

  const audioFile = req.files?.audio?.[0];
  const imageFile = req.files?.image?.[0];

  // Validaciones de entrada
  if (!title) return res.status(400).json({ error: "El título es obligatorio" });
  if (!description)
    return res.status(400).json({ error: "La descripción es obligatoria" });

  if (!audioFile) {
    return res
      .status(400)
      .json({ error: "Debe enviar un archivo de audio (campo: audio)" });
  }


  let audioResult = null;
  let imageResult = null;

  try {
    // Validar que exista archivo
    if (!req.files) {
      console.log("No se recibió ningún archivo en la solicitud");
      return res.status(400).json({ error: "Debe enviar un archivo de audio" });
    }
    console.log("Archivo recibido:", req.files.audio[0].originalname, req.files.audio[0].mimetype);


    // Validar que sea cualquier tipo de audio
    if (!audioFile.mimetype.startsWith("audio/")) {
      return res.status(400).json({ error: "Solo se permiten archivos de audio" });
    }


    // Subir a Cloudinary (audio se maneja como video) y eliminar archivo local
    const result = await uploadToCloudinary(audioFile.path, "video", "podcasts");
    console.log("Archivo de audio subido a Cloudinary:", result.secure_url);

    // 2) Subir portada si viene
    if (imageFile) {
      imageResult = await uploadToCloudinary(imageFile.path, "image", "podcast_covers");
    }

    // 3) Guardar en Mongo
    const newPodcast = await Podcast.create({
      title,
      description,
      audioUrl: result.secure_url,
      cloudinaryId: result.public_id,
      format: audioFile.mimetype,
      views: 0,

      // opcional
      imageUrl: imageResult?.secure_url ?? null,
      imageCloudinaryId: imageResult?.public_id ?? null,
    });

    return res.status(201).json(newPodcast);
  } catch (err) {
    console.error("Error creando podcast:", err);

    // Si subiste algo a Cloudinary y falló luego, intenta limpiar
    try {
      if (audioResult?.public_id) {
        await deleteFromCloudinary(audioResult.public_id, "video");
      }
      if (imageResult?.public_id) {
        await deleteFromCloudinary(imageResult.public_id, "image");
      }
    } catch (cleanupErr) {
      console.warn(
        "Cleanup Cloudinary falló:",
        cleanupErr?.message || cleanupErr,
      );
    }

    return res.status(500).json({ error: "Error al procesar el archivo" });
  } finally {
    // 4) Borrar archivos locales SIEMPRE
    // safeUnlink(audioFile?.path);
    // safeUnlink(imageFile?.path);
  }
};

// ===============================
// OBTENER (PUBLIC) - cursor pagination
// GET /podcasts?limit=20&cursor=BASE64URL
// ===============================
exports.getPodcasts = async (req, res) => {
  try {
    const limitRaw = req.query.limit;
    const cursorRaw = req.query.cursor;

    // límite defensivo
    let limit = Number.parseInt(String(limitRaw ?? "20"), 10);
    if (!Number.isFinite(limit) || limit <= 0) limit = 20;
    limit = Math.min(limit, 50); // hard cap para proteger servidor

    // Orden estable (CRÍTICO para cursor pagination)
    const sort = { createdAt: -1, _id: -1 };

    let filter = {};

    if (cursorRaw) {
      const c = decodeCursor(cursorRaw);
      if (!c) {
        return res.status(400).json({ error: "Cursor inválido" });
      }

      const cursorDate = new Date(c.t);

      // Para orden DESC: "siguiente página" => createdAt menor,
      // y si createdAt igual, _id menor
      filter = {
        ...filter,
        $or: [
          { createdAt: { $lt: cursorDate } },
          { createdAt: cursorDate, _id: { $lt: c.id } },
        ],
      };
    }

    // Pedimos limit+1 para saber si hay siguiente página
    const docs = await Podcast.find(filter).sort(sort).limit(limit + 1);

    const hasMore = docs.length > limit;
    const items = hasMore ? docs.slice(0, limit) : docs;

    let nextCursor = null;
    if (hasMore && items.length) {
      const last = items[items.length - 1];

      // Si NO tienes createdAt por timestamps, esto te quedará undefined y romperá el cursor.
      // En ese caso, arregla el schema Podcast con { timestamps: true }.
      nextCursor = encodeCursor({
        t: new Date(last.createdAt).toISOString(),
        id: String(last._id),
      });
    }

    return res.json({
      items,
      nextCursor, // null si no hay más
    });
  } catch (error) {
    console.error("Error al obtener podcasts:", error);
    return res.status(500).json({ error: "Error al obtener podcasts" });
  }
};

// ===============================
// OBTENER POR ID (SUMA VIEWS)
// ===============================
exports.getPodcastByID = async (req, res) => {
  try {
    const onePodcast = await Podcast.findById(req.params.id);
    if (!onePodcast) return res.status(404).json({ error: "Podcast no encontrado" });

    onePodcast.views += 1;
    await onePodcast.save();

    res.json(onePodcast);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el podcast" });
  }
};

// ===============================
// ACTUALIZAR METADATA (JSON)
// ===============================
exports.updatePodcast = async (req, res) => {
  try {
    // Whitelist para evitar que te actualicen campos sensibles por accidente
    const patch = {};
    if (typeof req.body.title === "string") patch.title = req.body.title;
    if (typeof req.body.description === "string")
      patch.description = req.body.description;

    const podcastToUpdate = await Podcast.findByIdAndUpdate(req.params.id, patch, {
      new: true,
      runValidators: true,
    });

    if (!podcastToUpdate) {
      return res.status(404).json({ error: "Podcast no encontrado" });
    }

    res.json(podcastToUpdate);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar podcast" });
  }
};

// ===============================
// ACTUALIZAR PORTADA (multipart: image)
// ===============================
exports.updatePodcastImage = async (req, res) => {
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ error: "Debe enviar una imagen (campo: image)" });
  }
  if (!isImage(imageFile.mimetype)) {
    // safeUnlink(imageFile.path);
    return res.status(400).json({ error: "Solo se permiten archivos de imagen" });
  }

  let imgResult = null;

  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      // safeUnlink(imageFile.path);
      return res.status(404).json({ error: "Podcast no encontrado" });
    }

    // Si hay una portada anterior, bórrala primero (mejor esfuerzo)
    if (podcast.imageCloudinaryId) {
      await deleteFromCloudinary(podcast.imageCloudinaryId, "image");
    }

    // Subir nueva portada
    imgResult = await uploadToCloudinary(imageFile.path,  "image","podcast_covers",);

    podcast.imageUrl = imgResult.secure_url;
    podcast.imageCloudinaryId = imgResult.public_id;

    await podcast.save();
    return res.json(podcast);
  } catch (err) {
    console.error("Error actualizando portada:", err);

    // Si se subió algo y luego falló, intenta borrar
    try {
      if (imgResult?.public_id) {
        await deleteFromCloudinary(imgResult.public_id, "image");
      }
    } catch (cleanupErr) {
      console.warn(
        "Cleanup Cloudinary falló:",
        cleanupErr?.message || cleanupErr,
      );
    }

    return res.status(500).json({ error: "Error al actualizar portada" });
  } finally {
    // safeUnlink(imageFile?.path);
  }
};

// ===============================
// ELIMINAR
// ===============================
exports.deletePodcast = async (req, res) => {
  try {
    const podcastToDelete = await Podcast.findById(req.params.id);
    if (!podcastToDelete) return res.status(404).json({ error: "Podcast no encontrado" });

    // Eliminar de Cloudinary (audio)
    await deleteFromCloudinary(podcastToDelete.cloudinaryId, "video");
   

    // Eliminar portada si existe
    if (podcastToDelete.imageCloudinaryId) {
      await deleteFromCloudinary(podcastToDelete.imageCloudinaryId, "image");
    }

    await podcastToDelete.deleteOne();
    res.json({ message: "Podcast eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar podcast" });
  }
};

// ===============================
// TOGGLE SAVE PODCAST
// ===============================
exports.toggleSavePodcast = async (req, res) => {
  try {
    const podcastId = req.params.id;
    const userId = req.userId;

    const podcast = await Podcast.findById(podcastId);
    if (!podcast) {
      return res.status(404).json({ error: "Podcast no encontrado" });
    }

    const user = await User.findById(userId).select("savedPodcasts");
    const idx = user.savedPodcasts.findIndex(
      (id) => id.toString() === podcastId
    );

    if (idx >= 0) {
      user.savedPodcasts.splice(idx, 1);
    } else {
      user.savedPodcasts.push(podcastId);
    }

    await user.save();

    return res.json({
      saved: idx < 0,
      savedPodcasts: user.savedPodcasts,
    });
  } catch (error) {
    console.error("Error toggle save podcast:", error);
    res.status(500).json({ error: "Error al guardar podcast" });
  }
};

// ===============================
// GET SAVED PODCASTS
// ===============================
exports.getSavedPodcasts = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId)
      .select("savedPodcasts")
      .populate("savedPodcasts");

    return res.json({ items: user.savedPodcasts || [] });
  } catch (error) {
    console.error("Error getting saved podcasts:", error);
    res.status(500).json({ error: "Error al obtener podcasts guardados" });
  }
};