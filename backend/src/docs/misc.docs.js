/* ════════════════════════════════════════════════════════════════
 *    ACHIEVEMENTS — Logros y medallas
 * ════════════════════════════════════════════════════════════════ */

/**
 * @swagger
 * /achievements/summary:
 *   get:
 *     tags: [Achievements]
 *     summary: Resumen de logros del usuario
 *     description: |
 *       Devuelve un resumen completo de los logros del usuario:
 *
 *       - **Racha:** Días consecutivos de actividad (actual y mejor)
 *       - **Progreso:** Cantidad de artículos, rutinas y desafíos completados
 *       - **Desafíos:** Conteo y los 5 más recientes completados
 *       - **Medallas:** Lista completa de medallas obtenidas
 *
 *       **Medallas disponibles:**
 *       | ID | Nombre | Condición |
 *       |---|---|---|
 *       | `FIRST_ARTICLE` | Primera lectura | Completar 1 artículo |
 *       | `FIRST_ROUTINE` | Primera rutina | Completar 1 rutina |
 *       | `FIRST_CHALLENGE` | Primer desafío | Completar 1 desafío |
 *       | `CHALLENGES_5` | 5 desafíos | Completar 5 desafíos |
 *       | `CHALLENGES_10` | 10 desafíos | Completar 10 desafíos |
 *       | `STREAK_3` | Racha de 3 | 3 días consecutivos activos |
 *       | `STREAK_7` | Racha de 7 | 7 días consecutivos activos |
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen de logros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 streak:
 *                   type: object
 *                   properties:
 *                     current:
 *                       type: integer
 *                       example: 5
 *                       description: Racha actual (días consecutivos)
 *                     best:
 *                       type: integer
 *                       example: 12
 *                       description: Mejor racha alcanzada
 *                     lastActiveLocalDate:
 *                       type: string
 *                       example: "2026-04-07"
 *                       description: Último día con actividad
 *                 progress:
 *                   type: object
 *                   properties:
 *                     completed:
 *                       type: object
 *                       properties:
 *                         article:
 *                           type: integer
 *                           example: 8
 *                         routine:
 *                           type: integer
 *                           example: 3
 *                         challenge:
 *                           type: integer
 *                           example: 5
 *                 challenges:
 *                   type: object
 *                   properties:
 *                     completedCount:
 *                       type: integer
 *                       example: 5
 *                     recent:
 *                       type: array
 *                       description: Los 5 desafíos completados más recientes
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           completedAt:
 *                             type: string
 *                             format: date-time
 *                 medals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "FIRST_ARTICLE"
 *                       earnedAt:
 *                         type: string
 *                         format: date-time
 *                       meta:
 *                         type: object
 *       401:
 *         description: Token no proporcionado
 */

/* ════════════════════════════════════════════════════════════════
 *    MOTIVATIONAL PHRASE — Frase motivacional
 * ════════════════════════════════════════════════════════════════ */

/* ── GET /motivational-phrase ── */
/**
 * @swagger
 * /motivational-phrase:
 *   get:
 *     tags: [Motivational Phrase]
 *     summary: Obtener la frase motivacional
 *     description: |
 *       Devuelve la frase motivacional del día.
 *       Solo hay **una frase en toda la base de datos** (patrón singleton).
 *
 *       **Nota:** Público, no requiere autenticación.
 *       El frontend la muestra en la pantalla de inicio.
 *     responses:
 *       200:
 *         description: Frase motivacional
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MotivationalPhrase'
 *       404:
 *         description: No se ha creado ninguna frase todavía
 *
 *   post:
 *     tags: [Motivational Phrase]
 *     summary: Crear la frase motivacional (Solo admin)
 *     description: |
 *       Crea la frase motivacional por primera vez.
 *       Si ya existe, devuelve error 409.
 *
 *       **Reglas:**
 *       - Máximo 300 caracteres.
 *       - Solo puede haber **una** frase en la BD.
 *       - Para cambiarla, usar `PUT`.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 300
 *                 example: "Cada día es una nueva oportunidad para cambiar el mundo "
 *               author:
 *                 type: string
 *                 example: "Anónimo"
 *                 description: Autor de la frase (opcional)
 *     responses:
 *       201:
 *         description: Frase creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MotivationalPhrase'
 *       400:
 *         description: Texto vacío o muy largo
 *       409:
 *         description: Ya existe una frase. Usar PUT para actualizarla.
 *
 *   put:
 *     tags: [Motivational Phrase]
 *     summary: Actualizar la frase motivacional (Solo admin)
 *     description: |
 *       Reemplaza el texto y/o autor de la frase existente.
 *       Si no se ha creado aún, devuelve 404.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 300
 *                 example: "El cambio comienza por ti "
 *               author:
 *                 type: string
 *                 example: "Equipo Planta"
 *     responses:
 *       200:
 *         description: Frase actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MotivationalPhrase'
 *       400:
 *         description: Texto vacío o muy largo
 *       404:
 *         description: No hay frase creada. Usar POST primero.
 */

/* ════════════════════════════════════════════════════════════════
 *  👤  ADMIN — Panel de administración
 * ════════════════════════════════════════════════════════════════ */

/* ── GET /admin/users ── */
/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Listar usuarios (Solo admin)
 *     description: |
 *       Devuelve una lista paginada de todos los usuarios registrados.
 *       Se puede buscar por nombre o correo.
 *
 *       **Nota:** El campo `password` nunca se incluye en la respuesta.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre o correo (búsqueda parcial)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Usuarios por página
 *     responses:
 *       200:
 *         description: Lista paginada de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 20
 *                 total:
 *                   type: integer
 *                   example: 150
 *                   description: Total de usuarios que coinciden con la búsqueda
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 */

/* ── GET /admin/users/:id ── */
/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Detalle de un usuario (Solo admin)
 *     description: |
 *       Devuelve el perfil completo de un usuario, incluyendo:
 *       - Datos básicos (nombre, email, rol, foto)
 *       - Gamificación (nivel, XP)
 *       - Estadísticas (racha, artículos/rutinas/desafíos completados)
 *       - Medallas obtenidas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalle del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [user, admin]
 *                 picture:
 *                   type: string
 *                   nullable: true
 *                 level:
 *                   type: integer
 *                   example: 3
 *                 xp:
 *                   type: integer
 *                   example: 250
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 stats:
 *                   type: object
 *                   properties:
 *                     streakCurrent:
 *                       type: integer
 *                     streakBest:
 *                       type: integer
 *                     lastActiveLocalDate:
 *                       type: string
 *                       nullable: true
 *                     completed:
 *                       type: object
 *                       properties:
 *                         article:
 *                           type: integer
 *                         routine:
 *                           type: integer
 *                         challenge:
 *                           type: integer
 *                 medals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       earnedAt:
 *                         type: string
 *                         format: date-time
 *                 challenges:
 *                   type: array
 *                   description: Desafíos aceptados por el usuario con su estado y progreso
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID del UserChallenge
 *                       title:
 *                         type: string
 *                         description: Nombre del desafío
 *                       category:
 *                         type: string
 *                         nullable: true
 *                         enum: [fitness, environment, wellness]
 *                       icon:
 *                         type: string
 *                         nullable: true
 *                       difficulty:
 *                         type: string
 *                         nullable: true
 *                         enum: [easy, medium, hard]
 *                       goalUnit:
 *                         type: string
 *                         nullable: true
 *                         example: "pasos"
 *                       status:
 *                         type: string
 *                         enum: [in_progress, completed, failed, abandoned]
 *                       progress:
 *                         type: number
 *                         example: 7500
 *                       goalValue:
 *                         type: number
 *                         example: 10000
 *                       startedAt:
 *                         type: string
 *                         format: date-time
 *                       completedAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       404:
 *         description: Usuario no encontrado
 *
 *   delete:
 *     tags: [Admin]
 *     summary: Eliminar un usuario (Solo admin)
 *     description: |
 *       Elimina permanentemente un usuario de la base de datos.
 *
 *       **Restricciones:**
 *       - Valida que el ID sea un ObjectId válido de MongoDB.
 *       - **No permite que el admin se elimine a sí mismo.**
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
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               message: "Usuario eliminado"
 *       400:
 *         description: ID inválido o intento de auto-eliminación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid_id:
 *                 value: { error: "ID inválido" }
 *               self_delete:
 *                 value: { error: "No puedes eliminarte a ti mismo" }
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       404:
 *         description: Usuario no encontrado
 */

/* ── PATCH /admin/users/:id/role ── */
/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     tags: [Admin]
 *     summary: Cambiar rol de un usuario (Solo admin)
 *     description: |
 *       Cambia el rol de un usuario entre `user` y `admin`.
 *
 *       **Restricciones:**
 *       - Solo acepta los valores `user` o `admin`.
 *       - **No permite que el admin cambie su propio rol.**
 *       - Valida que el ID sea un ObjectId válido de MongoDB.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario al que se le cambiará el rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: "admin"
 *                 description: Nuevo rol para el usuario
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rol actualizado correctamente"
 *                 id:
 *                   type: string
 *                   example: "664f1a2b3c4d5e6f7a8b9c0d"
 *                 role:
 *                   type: string
 *                   enum: [user, admin]
 *                   example: "admin"
 *       400:
 *         description: Rol inválido o intento de cambiar el propio rol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid_role:
 *                 value: { error: "Rol inválido. Debe ser 'user' o 'admin'" }
 *               self_change:
 *                 value: { error: "No puedes cambiar tu propio rol" }
 *               invalid_id:
 *                 value: { error: "ID de usuario inválido" }
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       404:
 *         description: Usuario no encontrado
 */

/* ════════════════════════════════════════════════════════════════
 *    NOTIFICATIONS — Notificaciones push
 * ════════════════════════════════════════════════════════════════ */

/**
 * @swagger
 * /notifications/register-token:
 *   post:
 *     tags: [Notifications]
 *     summary: Registrar token de push del dispositivo
 *     description: |
 *       Guarda el token FCM del dispositivo para recibir notificaciones push.
 *       Debe llamarse cada vez que la app arranca o el usuario inicia sesión.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pushToken]
 *             properties:
 *               pushToken:
 *                 type: string
 *                 description: Token FCM del dispositivo
 *     responses:
 *       200:
 *         description: Token registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token registrado
 *       400:
 *         description: pushToken es requerido
 *       401:
 *         description: Token no proporcionado
 */

/**
 * @swagger
 * /notifications/broadcast:
 *   post:
 *     tags: [Notifications]
 *     summary: Enviar notificación broadcast (admin)
 *     description: |
 *       Envía una notificación push a **todos** los usuarios que tienen
 *       un token de push registrado. Limpia automáticamente tokens inválidos.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, body]
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *                 example: "¡Nueva rutina disponible!"
 *               body:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Descubre la nueva rutina de meditación para principiantes."
 *     responses:
 *       200:
 *         description: Notificación enviada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notificación enviada
 *                 sent:
 *                   type: integer
 *                   example: 42
 *                 failed:
 *                   type: integer
 *                   example: 3
 *                 cleaned:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: title y body son requeridos
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       503:
 *         description: Firebase no está configurado en el servidor
 */
