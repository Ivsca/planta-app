/* ════════════════════════════════════════════════════════════════
 *    SETTINGS — Configuración general de la app
 * ════════════════════════════════════════════════════════════════ */

/* ── GET /settings ── */
/**
 * @swagger
 * /settings:
 *   get:
 *     tags: [Settings]
 *     summary: Obtener configuración de la app
 *     description: |
 *       Devuelve la configuración actual de la aplicación.
 *       Si aún no se ha configurado, devuelve los valores por defecto.
 *
 *       **Nota:** Público, no requiere autenticación.
 *     responses:
 *       200:
 *         description: Configuración actual
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppSettings'
 *       500:
 *         description: Error interno del servidor
 *
 *   put:
 *     tags: [Settings]
 *     summary: Actualizar configuración (Solo admin)
 *     description: |
 *       Crea o actualiza la configuración general de la app.
 *       Si no existía previamente, se crea automáticamente (upsert).
 *
 *       **Requiere:** Token de admin.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [achievementsGoal]
 *             properties:
 *               achievementsGoal:
 *                 type: integer
 *                 minimum: 1
 *                 example: 50
 *                 description: Meta de progreso general en la pantalla de logros
 *               whatsappNumber:
 *                 type: string
 *                 example: "573187767326"
 *                 description: Número de WhatsApp de soporte (con código de país, sin +)
 *     responses:
 *       200:
 *         description: Configuración actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppSettings'
 *       400:
 *         description: Campo obligatorio faltante o valor inválido
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: No tienes permisos de administrador
 *       500:
 *         description: Error interno del servidor
 */
