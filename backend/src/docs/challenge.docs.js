/* ════════════════════════════════════════════════════════════════
 *    CHALLENGES — Desafíos
 * ════════════════════════════════════════════════════════════════ */

/* ── GET /challenges ── */
/**
 * @swagger
 * /challenges:
 *   get:
 *     tags: [Challenges]
 *     summary: Listar desafíos activos (catálogo público)
 *     description: |
 *       Devuelve los desafíos activos (`isActive: true`).
 *       Se puede filtrar por categoría, dificultad, tipo y limitar resultados.
 *
 *       **Nota:** Público, no requiere autenticación.
 *       El frontend lo usa en la pantalla de "Juego" para mostrar el catálogo.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [fitness, environment, wellness]
 *         description: Filtrar por categoría
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Filtrar por dificultad
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [health_tracking, self_report, timer, qr_scan]
 *         description: Filtrar por tipo de seguimiento
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de resultados
 *     responses:
 *       200:
 *         description: Lista de desafíos activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 *
 *   post:
 *     tags: [Challenges]
 *     summary: Crear un desafío (Solo admin)
 *     description: |
 *       Crea un nuevo desafío.
 *
 *       **Tipos de desafío:**
 *       - `health_tracking` — Sincroniza automáticamente con Health Connect (pasos, distancia, etc.)
 *       - `self_report` — El usuario reporta manualmente su progreso
 *       - `timer` — Basado en tiempo
 *       - `qr_scan` — El usuario escanea un código QR en una ubicación física
 *
 *       **Para desafíos QR:** Se genera automáticamente un `codeId` único.
 *       El admin puede obtener la imagen del QR con `GET /challenges/admin/:id/qr`.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, category, type, goalValue, goalUnit]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Camina 10.000 pasos"
 *               description:
 *                 type: string
 *                 example: "Sal a caminar y alcanza la meta de pasos"
 *               category:
 *                 type: string
 *                 enum: [fitness, environment, wellness]
 *               type:
 *                 type: string
 *                 enum: [health_tracking, self_report, timer, qr_scan]
 *               healthMetric:
 *                 type: string
 *                 enum: [steps, distance, calories, activeMinutes, heartRate]
 *                 description: Requerido solo si type es `health_tracking`
 *               qrLocationLabel:
 *                 type: string
 *                 description: Etiqueta de ubicación (solo para `qr_scan`)
 *                 example: "Punto ecológico - Edificio A"
 *               goalValue:
 *                 type: number
 *                 example: 10000
 *                 description: Meta numérica a alcanzar
 *               goalUnit:
 *                 type: string
 *                 example: "pasos"
 *               duration:
 *                 type: integer
 *                 example: 1
 *                 description: Duración en días (por defecto 1)
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               icon:
 *                 type: string
 *                 example: "🚶"
 *               thumbnail:
 *                 type: string
 *                 description: URL de imagen de portada
 *               xpReward:
 *                 type: integer
 *                 example: 50
 *                 description: XP otorgados al completar (por defecto 50)
 *     responses:
 *       201:
 *         description: Desafío creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       400:
 *         description: Campos obligatorios faltantes
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 */

/* ── GET /challenges/:id ── */
/**
 * @swagger
 * /challenges/{id}:
 *   get:
 *     tags: [Challenges]
 *     summary: Obtener un desafío por ID
 *     description: Devuelve el desafío completo. Público, no requiere autenticación.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Desafío encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       404:
 *         description: Desafío no encontrado
 *
 *   put:
 *     tags: [Challenges]
 *     summary: Actualizar desafío (Solo admin)
 *     description: Actualización parcial de los campos del desafío.
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
 *               category:
 *                 type: string
 *                 enum: [fitness, environment, wellness]
 *               goalValue:
 *                 type: number
 *               goalUnit:
 *                 type: string
 *               duration:
 *                 type: integer
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               xpReward:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Desafío actualizado
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       404:
 *         description: Desafío no encontrado
 *
 *   delete:
 *     tags: [Challenges]
 *     summary: Eliminar desafío (Solo admin)
 *     description: |
 *       Elimina el desafío permanentemente.
 *       ** Los UserChallenge asociados NO se eliminan automáticamente.**
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
 *         description: Desafío eliminado
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       404:
 *         description: Desafío no encontrado
 */

/* ── POST /challenges/:id/start ── */
/**
 * @swagger
 * /challenges/{id}/start:
 *   post:
 *     tags: [Challenges]
 *     summary: Aceptar / iniciar un desafío
 *     description: |
 *       El usuario acepta un desafío y se crea un registro `UserChallenge`.
 *
 *       **Reglas:**
 *       - No se puede iniciar el mismo desafío si ya hay uno `in_progress`.
 *       - Se calcula `expiresAt` basado en la `duration` del desafío.
 *       - Se registra un evento de actividad `challenge_started`.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del desafío a iniciar
 *     responses:
 *       201:
 *         description: Desafío aceptado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserChallenge'
 *       400:
 *         description: Ya tienes este desafío en progreso
 *       401:
 *         description: Token no proporcionado
 *       404:
 *         description: Desafío no encontrado o inactivo
 */

/* ── GET /challenges/admin/all ── */
/**
 * @swagger
 * /challenges/admin/all:
 *   get:
 *     tags: [Challenges]
 *     summary: Listar TODOS los desafíos (Solo admin)
 *     description: Incluye desafíos activos e inactivos. Para el panel de administración.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de desafíos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 */

/* ── GET /challenges/admin/:id/qr ── */
/**
 * @swagger
 * /challenges/admin/{id}/qr:
 *   get:
 *     tags: [Challenges]
 *     summary: Obtener QR de un desafío (Solo admin)
 *     description: |
 *       Genera y devuelve la imagen del código QR para desafíos de tipo `qr_scan`.
 *       El QR contiene el `codeId` que el usuario debe escanear con la app.
 *
 *       **Uso:** El admin lo imprime y lo coloca en la ubicación física.
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
 *         description: Imagen QR en formato Data URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrDataUrl:
 *                   type: string
 *                   description: "Data URL (base64) de la imagen del QR"
 *                   example: "data:image/png;base64,iVBORw0KGgo..."
 *                 locationLabel:
 *                   type: string
 *                   example: "Punto ecológico - Edificio A"
 *       400:
 *         description: El desafío no es de tipo qr_scan
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       404:
 *         description: Desafío no encontrado
 */

/* ── GET /challenges/me ── */
/**
 * @swagger
 * /challenges/me:
 *   get:
 *     tags: [Challenges]
 *     summary: Mis desafíos aceptados
 *     description: |
 *       Devuelve los desafíos que el usuario ha aceptado, con su progreso.
 *       Se puede filtrar por estado.
 *
 *       Cada item incluye los datos del desafío original (populate de `challengeId`).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [in_progress, completed, failed, abandoned]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de desafíos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserChallenge'
 *       401:
 *         description: Token no proporcionado
 */

/* ── PATCH /challenges/me/:ucId/sync ── */
/**
 * @swagger
 * /challenges/me/{ucId}/sync:
 *   patch:
 *     tags: [Challenges]
 *     summary: Sincronizar dato de salud
 *     description: |
 *       Envía un dato de salud del día (pasos, distancia, calorías, etc.)
 *       desde Health Connect o Apple Health.
 *
 *       **¿Qué pasa internamente?**
 *       - Se guarda o actualiza el log del día en `dailyLogs`.
 *       - Se recalcula el `progress` total sumando todos los logs.
 *       - Si el progreso alcanza o supera `goalValue`, se completa automáticamente
 *         (otorga XP, medallas, actualiza racha).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ucId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del UserChallenge (no del Challenge)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, value]
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2026-04-07"
 *                 description: Fecha del dato (YYYY-MM-DD)
 *               value:
 *                 type: number
 *                 example: 7500
 *                 description: Valor registrado ese día
 *               source:
 *                 type: string
 *                 enum: [health_connect, apple_health, manual]
 *                 default: health_connect
 *     responses:
 *       200:
 *         description: Sincronización exitosa
 *       400:
 *         description: Datos inválidos o desafío no es in_progress
 *       401:
 *         description: Token no proporcionado
 *       404:
 *         description: UserChallenge no encontrado
 */

/* ── PATCH /challenges/me/:ucId/sync-bulk ── */
/**
 * @swagger
 * /challenges/me/{ucId}/sync-bulk:
 *   patch:
 *     tags: [Challenges]
 *     summary: Sincronizar múltiples datos de salud
 *     description: |
 *       Envía hasta **90 logs** de golpe (útil para sincronizar varios días acumulados).
 *
 *       Funciona igual que `/sync` pero en lote.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ucId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [logs]
 *             properties:
 *               logs:
 *                 type: array
 *                 maxItems: 90
 *                 items:
 *                   type: object
 *                   required: [date, value]
 *                   properties:
 *                     date:
 *                       type: string
 *                       example: "2026-04-07"
 *                     value:
 *                       type: number
 *                       example: 8000
 *                     source:
 *                       type: string
 *                       enum: [health_connect, apple_health, manual]
 *     responses:
 *       200:
 *         description: Sincronización en lote exitosa
 *       400:
 *         description: Datos inválidos o más de 90 logs
 *       401:
 *         description: Token no proporcionado
 *       404:
 *         description: UserChallenge no encontrado
 */

/* ── PATCH /challenges/me/:ucId/report ── */
/**
 * @swagger
 * /challenges/me/{ucId}/report:
 *   patch:
 *     tags: [Challenges]
 *     summary: Reportar progreso manual
 *     description: |
 *       Para desafíos de tipo `self_report`.
 *       El usuario reporta que realizó la acción (incrementa progress en 1 por defecto).
 *
 *       Si el progreso alcanza `goalValue`, se completa automáticamente.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ucId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 default: 1
 *                 description: Cantidad a sumar al progreso
 *     responses:
 *       200:
 *         description: Progreso actualizado
 *       400:
 *         description: Desafío no es in_progress o no es self_report
 *       401:
 *         description: Token no proporcionado
 *       404:
 *         description: UserChallenge no encontrado
 */

/* ── PATCH /challenges/me/:ucId/scan ── */
/**
 * @swagger
 * /challenges/me/{ucId}/scan:
 *   patch:
 *     tags: [Challenges]
 *     summary: Escanear código QR
 *     description: |
 *       Para desafíos de tipo `qr_scan`.
 *       El usuario escanea un QR con la app y envía el valor.
 *
 *       **¿Qué valida?**
 *       - Que el `scannedValue` coincida con el `codeId` del desafío.
 *       - Si coincide, completa el desafío inmediatamente (otorga XP, etc.).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ucId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [scannedValue]
 *             properties:
 *               scannedValue:
 *                 type: string
 *                 description: Valor leído del código QR
 *     responses:
 *       200:
 *         description: QR válido, desafío completado
 *       400:
 *         description: QR inválido o desafío no es qr_scan
 *       401:
 *         description: Token no proporcionado
 *       404:
 *         description: UserChallenge no encontrado
 */

/* ── PATCH /challenges/me/:ucId/abandon ── */
/**
 * @swagger
 * /challenges/me/{ucId}/abandon:
 *   patch:
 *     tags: [Challenges]
 *     summary: Abandonar un desafío
 *     description: |
 *       Marca el desafío como `abandoned`.
 *       El progreso se conserva pero el desafío ya no cuenta como activo.
 *
 *       El usuario puede volver a aceptar el mismo desafío después.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ucId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Desafío abandonado
 *       400:
 *         description: Desafío no está en progreso
 *       401:
 *         description: Token no proporcionado
 *       404:
 *         description: UserChallenge no encontrado
 */
