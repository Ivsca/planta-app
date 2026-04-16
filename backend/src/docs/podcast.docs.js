/* ════════════════════════════════════════════════════════════════
 *    PODCASTS
 * ════════════════════════════════════════════════════════════════ */

/* ── GET /podcasts ── */
/**
 * @swagger
 * /podcasts:
 *   get:
 *     tags: [Podcasts]
 *     summary: Listar podcasts (con paginación por cursor)
 *     description: |
 *       Devuelve los podcasts ordenados del más reciente al más antiguo.
 *
 *       **Paginación por cursor:**
 *       En lugar de usar `page`, se usa un `cursor` codificado en Base64.
 *       La primera petición se hace sin cursor; las siguientes usan el
 *       `nextCursor` que devuelve la respuesta anterior.
 *
 *       **¿Por qué cursor y no paginación tradicional?**
 *       Es más eficiente con MongoDB cuando hay muchos documentos,
 *       porque no necesita contar todos los registros.
 *
 *       **Nota:** Público, no requiere autenticación.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 50
 *         description: Cantidad de podcasts por página (máximo 50)
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Cursor de la página anterior (Base64). Omitir para la primera página.
 *     responses:
 *       200:
 *         description: Lista de podcasts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Podcast'
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 *                   description: "Cursor para la siguiente página. `null` si no hay más."
 *       500:
 *         description: Error interno del servidor
 *
 *   post:
 *     tags: [Podcasts]
 *     summary: Crear podcast (Solo admin)
 *     description: |
 *       Sube un podcast con archivo de audio (obligatorio) e imagen de portada (opcional).
 *
 *       **¿Qué pasa con el audio?**
 *       - Se sube a **Cloudinary** como recurso de tipo `video` (Cloudinary los maneja igual).
 *       - Se guarda la URL pública, el `cloudinaryId`, formato y duración.
 *
 *       **Requiere:** Token de admin. Enviar como `multipart/form-data`.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, audio]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Episodio 1: Vida sostenible"
 *               description:
 *                 type: string
 *                 example: "En este episodio hablamos sobre..."
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de audio (mp3, mp4, wav, etc.)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de portada (opcional)
 *     responses:
 *       201:
 *         description: Podcast creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Podcast'
 *       400:
 *         description: Faltan campos obligatorios o no se subió audio
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 */

/* ── GET /podcasts/:id ── */
/**
 * @swagger
 * /podcasts/{id}:
 *   get:
 *     tags: [Podcasts]
 *     summary: Obtener podcast por ID
 *     description: |
 *       Devuelve un podcast específico.
 *       **Incrementa automáticamente el contador de vistas** (`views + 1`).
 *
 *       Público, no requiere autenticación.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del podcast
 *     responses:
 *       200:
 *         description: Podcast encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Podcast'
 *       404:
 *         description: Podcast no encontrado
 *
 *   put:
 *     tags: [Podcasts]
 *     summary: Actualizar título y descripción (Solo admin)
 *     description: |
 *       Actualiza solo los campos `title` y/o `description` del podcast.
 *       Para cambiar la imagen, usa `PUT /podcasts/:id/image`.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Podcast actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Podcast'
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       404:
 *         description: Podcast no encontrado
 *
 *   delete:
 *     tags: [Podcasts]
 *     summary: Eliminar podcast (Solo admin)
 *     description: |
 *       Elimina el podcast de la base de datos y su audio + imagen de Cloudinary.
 *
 *       ** Esta acción es irreversible.**
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Podcast eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       404:
 *         description: Podcast no encontrado
 */

/* ── POST /podcasts/:id/save ── */
/**
 * @swagger
 * /podcasts/{id}/save:
 *   post:
 *     tags: [Podcasts]
 *     summary: Guardar / quitar de guardados un podcast
 *     description: |
 *       Alterna el estado de "guardado" del podcast para el usuario autenticado.
 *       - Si el podcast **no estaba guardado**, se agrega a la lista.
 *       - Si **ya estaba guardado**, se elimina de la lista.
 *
 *       **Requiere:** Autenticación.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del podcast
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     responses:
 *       200:
 *         description: Estado de guardado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 saved:
 *                   type: boolean
 *                   description: "`true` si quedó guardado, `false` si se quitó"
 *                 savedPodcasts:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista actualizada de IDs de podcasts guardados
 *       401:
 *         description: Token no proporcionado
 *       404:
 *         description: Podcast no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/* ── GET /podcasts/saved/me ── */
/**
 * @swagger
 * /podcasts/saved/me:
 *   get:
 *     tags: [Podcasts]
 *     summary: Obtener podcasts guardados del usuario
 *     description: |
 *       Devuelve la lista completa de podcasts que el usuario ha guardado,
 *       con los documentos poblados (no solo IDs).
 *
 *       **Requiere:** Autenticación.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de podcasts guardados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Podcast'
 *       401:
 *         description: Token no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
/**
 * @swagger
 * /podcasts/{id}/image:
 *   put:
 *     tags: [Podcasts]
 *     summary: Actualizar imagen de portada (Solo admin)
 *     description: |
 *       Reemplaza la imagen de portada del podcast.
 *       Si ya tenía una imagen en Cloudinary, la anterior se elimina automáticamente.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen de portada
 *     responses:
 *       200:
 *         description: Imagen actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Podcast'
 *       400:
 *         description: No se envió imagen
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       404:
 *         description: Podcast no encontrado
 */
