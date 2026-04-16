/* ════════════════════════════════════════════════════════════════
 *  🔐  AUTH — Autenticación y gestión de cuenta
 * ════════════════════════════════════════════════════════════════ */

/* ── POST /auth/register ── */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un nuevo usuario
 *     description: |
 *       Crea una cuenta nueva con correo y contraseña.
 *
 *       **¿Qué pasa internamente?**
 *       1. Se valida que `name`, `email` y `password` estén presentes.
 *       2. Se verifica que el correo no exista en la base de datos.
 *       3. La contraseña se hashea automáticamente con **bcrypt** (en el pre-save del modelo).
 *       4. Se crea el usuario y se genera un **token JWT** válido por 30 días.
 *
 *       **Nota:** Este endpoint NO requiere autenticación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "María García"
 *                 description: Nombre completo del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "maria@example.com"
 *                 description: Correo electrónico (debe ser único)
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "miContraseña123"
 *                 description: Contraseña (mínimo 6 caracteres)
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Faltan campos obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Todos los campos son obligatorios"
 *       409:
 *         description: El correo ya está registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "El correo ya está registrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/* ── POST /auth/login ── */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión con correo y contraseña
 *     description: |
 *       Autentica a un usuario existente y devuelve un token JWT.
 *
 *       **¿Qué pasa internamente?**
 *       1. Se busca el usuario por `email`.
 *       2. Se compara la contraseña con el hash almacenado usando **bcrypt**.
 *       3. Si todo es correcto, se genera un token JWT válido por 30 días.
 *
 *       **Nota:** Este endpoint NO requiere autenticación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "maria@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "miContraseña123"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Faltan campos obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Correo y contraseña son obligatorios"
 *       401:
 *         description: Credenciales incorrectas (email no existe o contraseña incorrecta)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Credenciales incorrectas"
 *       500:
 *         description: Error interno del servidor
 */

/* ── POST /auth/google ── */
/**
 * @swagger
 * /auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión con Google (OAuth)
 *     description: |
 *       Permite autenticarse con una cuenta de Google.
 *       El frontend obtiene un `idToken` del SDK nativo de Google y lo envía aquí.
 *
 *       **¿Qué pasa internamente?**
 *       1. Se verifica el `idToken` con la librería `google-auth-library`.
 *       2. Se extrae `googleId`, `email`, `name` y `picture` del payload de Google.
 *       3. Se busca al usuario por `googleId`:
 *          - **Si existe:** Se autentica directamente.
 *          - **Si no existe pero el email coincide:** Se vincula la cuenta existente con Google.
 *          - **Si no existe en absoluto:** Se crea un usuario nuevo (sin contraseña).
 *       4. Se genera un token JWT válido por 30 días.
 *
 *       **Nota:** Este endpoint NO requiere autenticación previa.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Token de ID obtenido del SDK de Google Sign-In
 *                 example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Login con Google exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Falta el idToken o no se obtuvo email de Google
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token de Google inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Token de Google inválido"
 *       500:
 *         description: Error interno del servidor
 */

/* ── GET /auth/me ── */
/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener perfil del usuario autenticado
 *     description: |
 *       Devuelve toda la información del usuario actual (excepto la contraseña).
 *
 *       **¿Cómo funciona?**
 *       - Se extrae el token JWT del header `Authorization: Bearer <token>`.
 *       - Se decodifica y se busca al usuario en la BD.
 *       - Se devuelve el objeto completo (incluye actividad, medallas, stats, etc.).
 *
 *       **Uso común:** El frontend lo usa cada vez que se enfoca la pantalla de perfil
 *       para obtener datos actualizados de XP, nivel y racha.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado (fue eliminado o el token es de un usuario que ya no existe)
 *
 *   put:
 *     tags: [Auth]
 *     summary: Actualizar perfil (nombre y/o contraseña)
 *     description: |
 *       Permite al usuario cambiar su nombre y/o contraseña.
 *
 *       **Reglas:**
 *       - El **correo NO se puede cambiar** (por seguridad).
 *       - El **nombre** no puede quedar vacío.
 *       - La **contraseña** debe tener mínimo 6 caracteres.
 *       - Se pueden enviar ambos campos o solo uno.
 *
 *       **¿Qué pasa internamente?**
 *       Si se envía contraseña, el hook `pre("save")` del modelo la hashea
 *       automáticamente con bcrypt.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "María García López"
 *                 description: Nuevo nombre (opcional)
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "nuevaContraseña456"
 *                 description: Nueva contraseña (opcional, mín. 6 caracteres)
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Nombre vacío o contraseña muy corta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Usuario no encontrado
 *
 *   delete:
 *     tags: [Auth]
 *     summary: Eliminar cuenta del usuario
 *     description: |
 *       Elimina permanentemente la cuenta del usuario autenticado.
 *
 *       **⚠️ Esta acción es irreversible.**
 *
 *       Se elimina el documento completo del usuario de la base de datos,
 *       incluyendo toda su actividad, medallas y progreso.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               message: "Cuenta eliminada correctamente"
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Usuario no encontrado
 */
