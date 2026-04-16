/* ════════════════════════════════════════════════════════════════
 *    ACTIVITY — Actividad del usuario
 * ════════════════════════════════════════════════════════════════ */

/* ── GET /activity/me ── */
/**
 * @swagger
 * /activity/me:
 *   get:
 *     tags: [Activity]
 *     summary: Obtener actividad del usuario
 *     description: |
 *       Devuelve el contenido en progreso (`inProgress`) y los últimos 20 eventos
 *       de actividad del usuario.
 *
 *       **¿Qué incluye `inProgress`?**
 *       - `article` — Artículo que el usuario está leyendo (con índice del slide actual)
 *       - `routine` — Rutina en progreso (con paso actual)
 *       - `challenge` — Desafío en progreso
 *
 *       **¿Qué son los eventos?**
 *       Son registros de acciones como: "empezó un artículo", "completó una rutina",
 *       "envió un quiz", etc. Se usan para la pantalla de "Mi actividad".
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Actividad del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inProgress:
 *                   type: object
 *                   description: Contenido que el usuario tiene a medias
 *                   properties:
 *                     article:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         refId:
 *                           type: string
 *                           description: ID del artículo
 *                         lastSeenIndex:
 *                           type: integer
 *                           description: Último slide visto
 *                         furthestIndex:
 *                           type: integer
 *                           description: Slide más avanzado alcanzado
 *                     routine:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         refId:
 *                           type: string
 *                         step:
 *                           type: integer
 *                     challenge:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         refId:
 *                           type: string
 *                         progress:
 *                           type: number
 *                 events:
 *                   type: array
 *                   description: Últimos 20 eventos de actividad
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [article_started, article_completed, routine_started, routine_completed, challenge_started, challenge_completed, quiz_submitted]
 *                       refType:
 *                         type: string
 *                         enum: [article, routine, challenge, quiz]
 *                       refId:
 *                         type: string
 *                       at:
 *                         type: string
 *                         format: date-time
 *                       localDate:
 *                         type: string
 *                         example: "2026-04-07"
 *       401:
 *         description: Token no proporcionado
 */

/* ── GET /activity/article/:id/in-progress ── */
/**
 * @swagger
 * /activity/article/{id}/in-progress:
 *   get:
 *     tags: [Activity]
 *     summary: Ver progreso de lectura de un artículo
 *     description: |
 *       Devuelve el progreso de lectura de un artículo específico.
 *
 *       **Uso:** El frontend lo usa para reanudar la lectura desde donde
 *       se quedó el usuario (volver al slide correcto).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Progreso del artículo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 found:
 *                   type: boolean
 *                   description: "`true` si hay progreso guardado"
 *                 lastSeenIndex:
 *                   type: integer
 *                   description: Último slide visto
 *                 furthestIndex:
 *                   type: integer
 *                   description: Slide más avanzado alcanzado
 *       401:
 *         description: Token no proporcionado
 */

/* ── POST /activity/event ── */
/**
 * @swagger
 * /activity/event:
 *   post:
 *     tags: [Activity]
 *     summary: Registrar un evento de actividad
 *     description: |
 *       Registra que el usuario realizó una acción (empezó artículo, completó rutina, etc.).
 *
 *       **Tipos de evento permitidos:**
 *       - `article_started` / `article_completed`
 *       - `routine_started` / `routine_completed`
 *       - `challenge_started` / `challenge_completed`
 *       - `quiz_submitted`
 *
 *       **¿Qué pasa internamente?**
 *       1. Se valida el tipo de evento y refType.
 *       2. Para eventos de tipo `completed`, es **idempotente** (si ya existe, no se duplica).
 *       3. Se actualiza la racha del usuario (`activity.stats.streakCurrent`).
 *       4. Se verifican y otorgan medallas automáticamente.
 *
 *       **Nota sobre `meta`:** Campo opcional para datos extras.
 *       Por ejemplo, en `quiz_submitted` puede contener `{ score: 8, total: 10 }`.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, refType, refId]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [article_started, article_completed, routine_started, routine_completed, challenge_started, challenge_completed, quiz_submitted]
 *                 description: Tipo de evento
 *               refType:
 *                 type: string
 *                 enum: [article, routine, challenge, quiz]
 *                 description: Tipo de recurso relacionado
 *               refId:
 *                 type: string
 *                 description: ID del recurso (artículo, rutina, desafío o quiz)
 *               meta:
 *                 type: object
 *                 description: Datos adicionales (opcional)
 *                 example: { "score": 8, "total": 10 }
 *     responses:
 *       200:
 *         description: Evento registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 duplicate:
 *                   type: boolean
 *                   description: "`true` si el evento ya existía (idempotente)"
 *       400:
 *         description: Tipo de evento o refType inválido
 *       401:
 *         description: Token no proporcionado
 */

/* ── PATCH /activity/in-progress ── */
/**
 * @swagger
 * /activity/in-progress:
 *   patch:
 *     tags: [Activity]
 *     summary: Actualizar progreso de contenido en curso
 *     description: |
 *       Guarda el progreso parcial del usuario en un artículo, rutina o desafío.
 *
 *       **Payloads según refType:**
 *
 *       Para `article`:
 *       ```json
 *       { "refType": "article", "refId": "...", "payload": { "slideIndex": 3 } }
 *       ```
 *
 *       Para `routine`:
 *       ```json
 *       { "refType": "routine", "refId": "...", "payload": { "step": 2 } }
 *       ```
 *
 *       Para `challenge`:
 *       ```json
 *       { "refType": "challenge", "refId": "...", "payload": { "progress": 5000 } }
 *       ```
 *
 *       **Nota:** Para artículos, se guarda tanto `lastSeenIndex` como  `furthestIndex`
 *       (el más avanzado que haya alcanzado el usuario).
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refType, refId]
 *             properties:
 *               refType:
 *                 type: string
 *                 enum: [article, routine, challenge]
 *               refId:
 *                 type: string
 *                 description: ID del contenido
 *               payload:
 *                 type: object
 *                 description: Datos del progreso (ver ejemplos arriba)
 *     responses:
 *       200:
 *         description: Progreso actualizado
 *       400:
 *         description: refType inválido
 *       401:
 *         description: Token no proporcionado
 */
