/* ════════════════════════════════════════════════════════════════
 *    HEALTH CHECK
 * ════════════════════════════════════════════════════════════════ */

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Verificar estado del servidor
 *     description: |
 *       Endpoint simple para comprobar que el servidor está corriendo.
 *       No requiere autenticación.
 *
 *       **¿Para qué sirve?**
 *       Lo usan herramientas de monitoreo (como UptimeRobot) o el frontend
 *       para saber si el backend está disponible antes de hacer otras peticiones.
 *     responses:
 *       200:
 *         description: El servidor está funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-07T14:30:00.000Z"
 */
