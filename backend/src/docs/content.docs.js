/* ════════════════════════════════════════════════════════════════
 *    CONTENT — Artículos, videos y rutinas
 * ════════════════════════════════════════════════════════════════ */

/* ── GET /content ── */
/**
 * @swagger
 * /content:
 *   get:
 *     tags: [Content]
 *     summary: Listar contenido publicado
 *     description: |
 *       Devuelve contenido con estado `published`.
 *       Se puede filtrar por tipo, categoría, destacados y búsqueda de texto.
 *
 *       **Nota:** Este endpoint es público (no requiere autenticación).
 *       El frontend lo usa en la pantalla de "Descubrir" y en el inicio.
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [video, article]
 *         description: Filtrar por tipo de contenido
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [environment, fitness, routine, challenges, welcome, products]
 *         description: Filtrar por categoría temática
 *       - in: query
 *         name: featured
 *         schema:
 *           type: string
 *           enum: ["true"]
 *         description: Si se envía `true`, solo devuelve contenido destacado
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por título (búsqueda parcial, insensible a mayúsculas)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Número máximo de resultados
 *     responses:
 *       200:
 *         description: Lista de contenido publicado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Content'
 *       500:
 *         description: Error interno del servidor
 *
 *   post:
 *     tags: [Content]
 *     summary: Crear nuevo contenido (Solo admin)
 *     description: |
 *       Crea un artículo, video o rutina nueva.
 *
 *       **Tipos de video soportados:**
 *       - `youtube` — Solo enviar el ID de YouTube (ej: `dQw4w9WgXcQ`)
 *       - `url` — Enviar la URL completa del video
 *       - `upload` — Subir archivo de video (usar `multipart/form-data`)
 *
 *       **¿Qué pasa con los videos subidos?**
 *       Se suben a **Cloudinary** en la carpeta `planta-app/content/videos`.
 *       Se guarda la URL pública y el `cloudinaryId` para poder eliminarlo después.
 *
 *       **Requiere:** Token de admin.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [type, category, title]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [video, article]
 *               category:
 *                 type: string
 *                 enum: [environment, fitness, routine, challenges, welcome, products]
 *               title:
 *                 type: string
 *                 example: "Cómo reciclar en casa"
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 description: URL de la imagen de portada
 *               body:
 *                 type: string
 *                 description: Contenido HTML/Markdown del artículo
 *               videoSource:
 *                 type: string
 *                 enum: [youtube, url, upload]
 *               videoUrl:
 *                 type: string
 *                 description: URL del video (si videoSource es `url`)
 *               youtubeId:
 *                 type: string
 *                 description: ID de YouTube (si videoSource es `youtube`)
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de video (si videoSource es `upload`)
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 default: draft
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Contenido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       400:
 *         description: Campos obligatorios faltantes o tipo de video inválido
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       500:
 *         description: Error interno del servidor
 */

/* ── GET /content/admin/all ── */
/**
 * @swagger
 * /content/admin/all:
 *   get:
 *     tags: [Content]
 *     summary: Listar TODO el contenido (Solo admin)
 *     description: |
 *       Devuelve **todo** el contenido incluyendo borradores y archivados.
 *       Solo accesible por administradores.
 *
 *       **Uso:** Panel de administración para gestionar contenido.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de contenido
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Content'
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 */

/* ── GET /content/:id ── */
/**
 * @swagger
 * /content/{id}:
 *   get:
 *     tags: [Content]
 *     summary: Obtener un contenido por ID
 *     description: |
 *       Devuelve el contenido completo (artículo/video).
 *       **Incrementa automáticamente el contador de vistas** (`views + 1`).
 *
 *       **Nota:** Es público, no requiere autenticación.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del contenido (MongoDB ObjectId)
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     responses:
 *       200:
 *         description: Contenido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       404:
 *         description: Contenido no encontrado
 *       500:
 *         description: Error interno del servidor
 *
 *   put:
 *     tags: [Content]
 *     summary: Actualizar contenido (Solo admin)
 *     description: |
 *       Actualiza un artículo o video existente.
 *       Si se cambia el video, el anterior se elimina de Cloudinary automáticamente.
 *
 *       **Requiere:** Token de admin.
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               body:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               videoSource:
 *                 type: string
 *                 enum: [youtube, url, upload]
 *               videoUrl:
 *                 type: string
 *               youtubeId:
 *                 type: string
 *               video:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Contenido actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       404:
 *         description: Contenido no encontrado
 *
 *   delete:
 *     tags: [Content]
 *     summary: Eliminar contenido (Solo admin)
 *     description: |
 *       Elimina un contenido de la base de datos.
 *       Si tiene video o thumbnail en Cloudinary, también se elimina de allí.
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
 *         description: Contenido eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       404:
 *         description: Contenido no encontrado
 */

/* ── POST /content/:id/complete ── */
/**
 * @swagger
 * /content/{id}/complete:
 *   post:
 *     tags: [Content]
 *     summary: Marcar contenido como completado
 *     description: |
 *       Registra que el usuario terminó de leer un artículo o completó una rutina.
 *
 *       **¿Qué pasa internamente?**
 *       - Es **idempotente**: si ya lo completó, no hace nada extra.
 *       - Registra un evento de actividad (`article_completed` o `routine_completed`).
 *       - Actualiza la racha del usuario.
 *       - Puede otorgar medallas (`FIRST_ARTICLE`, `FIRST_ROUTINE`).
 *       - Suma **XP** al usuario.
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
 *         description: ID del contenido completado
 *     responses:
 *       200:
 *         description: Contenido marcado como completado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Token no proporcionado
 *       404:
 *         description: Contenido no encontrado
 */

/* ── GET /content/:id/completion-status ── */
/**
 * @swagger
 * /content/{id}/completion-status:
 *   get:
 *     tags: [Content]
 *     summary: Verificar si el usuario completó un contenido
 *     description: |
 *       Devuelve si el usuario autenticado ya completó el contenido dado.
 *
 *       **Uso:** El frontend lo usa para mostrar una insignia de "completado"
 *       en los artículos y rutinas.
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
 *         description: Estado de completado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 completed:
 *                   type: boolean
 *                   example: false
 *                   description: "`true` si el usuario ya completó este contenido"
 *                 contentKind:
 *                   type: string
 *                   example: "article"
 *       401:
 *         description: Token no proporcionado
 *       404:
 *         description: Contenido no encontrado
 */

/* ── POST /content/:id/save ── */
/**
 * @swagger
 * /content/{id}/save:
 *   post:
 *     tags: [Content]
 *     summary: Guardar / quitar de guardados un contenido
 *     description: |
 *       Alterna el estado de "guardado" del contenido para el usuario autenticado.
 *       - Si el contenido **no estaba guardado**, se agrega a la lista.
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
 *         description: ID del contenido
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
 *                 savedContent:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista actualizada de IDs de contenido guardado
 *       401:
 *         description: Token no proporcionado
 *       404:
 *         description: Contenido no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/* ── GET /content/saved/me ── */
/**
 * @swagger
 * /content/saved/me:
 *   get:
 *     tags: [Content]
 *     summary: Obtener contenido guardado del usuario
 *     description: |
 *       Devuelve la lista completa de contenido que el usuario ha guardado,
 *       con los documentos poblados (no solo IDs).
 *
 *       **Requiere:** Autenticación.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contenido guardado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *       401:
 *         description: Token no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
