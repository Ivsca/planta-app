const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Planta de Transformación — API",
      version: "1.0.0",
      description:
        "Documentación completa de la API REST del proyecto **Planta de Transformación**.\n\n" +
        "Esta API alimenta la aplicación móvil (Expo / React Native) y permite:\n" +
        "-  Autenticación (correo/contraseña y Google OAuth)\n" +
        "-  Gestión de contenido (artículos, videos, rutinas)\n" +
        "-  Podcasts con audio en la nube\n" +
        "-  Desafíos con seguimiento de progreso y QR\n" +
        "-  Actividad del usuario (racha, medallas, eventos)\n" +
        "-  Panel de administración\n" +
        "-  Frase motivacional del día\n\n" +
        "**Base URL:** `http://localhost:5000/api`",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Servidor de desarrollo local",
      },
    ],
    tags: [
      { name: "Health", description: "Estado del servidor" },
      { name: "Auth", description: "Registro, login, perfil de usuario y Google OAuth" },
      { name: "Content", description: "Artículos, videos y rutinas educativas" },
      { name: "Podcasts", description: "Gestión y reproducción de podcasts" },
      { name: "Challenges", description: "Desafíos ambientales, fitness y bienestar" },
      { name: "Activity", description: "Actividad del usuario, racha y progreso" },
      { name: "Achievements", description: "Resumen de logros y medallas" },
      { name: "Motivational Phrase", description: "Frase motivacional del día (singleton)" },
      { name: "Admin", description: "Operaciones exclusivas de administradores" },
      { name: "Settings", description: "Configuración general de la aplicación" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Token JWT obtenido al hacer login o registro.\n\n" +
            "Cópialo y pégalo aquí (sin el prefijo `Bearer `).\n\n" +
            "El token expira en **30 días**.",
        },
      },
      schemas: {
        // ─── Usuario ───
        User: {
          type: "object",
          description: "Representa un usuario registrado en la plataforma.",
          properties: {
            id:       { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d", description: "ID único del usuario (MongoDB ObjectId)" },
            name:     { type: "string", example: "María García", description: "Nombre completo del usuario" },
            email:    { type: "string", format: "email", example: "maria@example.com", description: "Correo electrónico (único, en minúsculas)" },
            role:     { type: "string", enum: ["user", "admin"], example: "user", description: "Rol del usuario" },
            level:    { type: "integer", example: 3, description: "Nivel actual basado en XP (cada 100 XP = 1 nivel)" },
            xp:       { type: "integer", example: 250, description: "Puntos de experiencia acumulados" },
            picture:  { type: "string", nullable: true, example: "https://lh3.googleusercontent.com/...", description: "URL de la foto de perfil (de Google OAuth)" },
          },
        },
        AuthResponse: {
          type: "object",
          description: "Respuesta exitosa de autenticación (login, registro o Google).",
          properties: {
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIs...", description: "Token JWT válido por 30 días" },
            user:  { $ref: "#/components/schemas/User" },
          },
        },
        // ─── Contenido ───
        Content: {
          type: "object",
          description: "Un artículo, video o rutina publicada en la plataforma.",
          properties: {
            _id:              { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
            type:             { type: "string", enum: ["video", "article"], description: "Tipo de contenido" },
            category:         { type: "string", enum: ["environment", "fitness", "routine", "challenges", "welcome", "products"], description: "Categoría temática" },
            title:            { type: "string", example: "Cómo reciclar en casa" },
            description:      { type: "string", example: "Guía paso a paso para separar residuos" },
            thumbnail:        { type: "string", example: "https://res.cloudinary.com/..." },
            videoSource:      { type: "string", enum: ["youtube", "url", "upload"], nullable: true, description: "Origen del video (solo si type=video)" },
            videoUrl:         { type: "string", nullable: true, description: "URL del video (si videoSource es url o upload)" },
            youtubeId:        { type: "string", nullable: true, description: "ID de YouTube (si videoSource es youtube)" },
            body:             { type: "string", description: "Cuerpo HTML/Markdown del artículo" },
            views:            { type: "integer", example: 42 },
            isNew:            { type: "boolean" },
            isFeatured:       { type: "boolean" },
            status:           { type: "string", enum: ["draft", "published", "archived"] },
            createdAt:        { type: "string", format: "date-time" },
            updatedAt:        { type: "string", format: "date-time" },
          },
        },
        // ─── Podcast ───
        Podcast: {
          type: "object",
          description: "Un podcast con audio almacenado en Cloudinary.",
          properties: {
            _id:         { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
            title:       { type: "string", example: "Episodio 1: Vida sostenible" },
            description: { type: "string" },
            audioUrl:    { type: "string", description: "URL del audio en Cloudinary" },
            imageUrl:    { type: "string", nullable: true, description: "URL de la portada" },
            format:      { type: "string", example: "audio/mp4" },
            duration:    { type: "number", description: "Duración en segundos" },
            views:       { type: "integer", example: 15 },
            createdAt:   { type: "string", format: "date-time" },
            updatedAt:   { type: "string", format: "date-time" },
          },
        },
        // ─── Desafío ───
        Challenge: {
          type: "object",
          description: "Un desafío que los usuarios pueden aceptar y completar.",
          properties: {
            _id:         { type: "string" },
            title:       { type: "string", example: "Camina 10.000 pasos hoy" },
            description: { type: "string" },
            category:    { type: "string", enum: ["fitness", "environment", "wellness"] },
            type:        { type: "string", enum: ["health_tracking", "self_report", "timer", "qr_scan"], description: "Tipo de seguimiento" },
            healthMetric: { type: "string", enum: ["steps", "distance", "calories", "activeMinutes", "heartRate"], nullable: true },
            goalValue:   { type: "number", example: 10000, description: "Meta numérica a alcanzar" },
            goalUnit:    { type: "string", example: "pasos" },
            duration:    { type: "integer", example: 1, description: "Duración en días" },
            difficulty:  { type: "string", enum: ["easy", "medium", "hard"] },
            icon:        { type: "string", example: "🏆" },
            xpReward:    { type: "integer", example: 50, description: "XP otorgados al completar" },
            isActive:    { type: "boolean" },
            createdAt:   { type: "string", format: "date-time" },
          },
        },
        // ─── Desafío del usuario ───
        UserChallenge: {
          type: "object",
          description: "Relación entre un usuario y un desafío aceptado.",
          properties: {
            _id:         { type: "string" },
            userId:      { type: "string", description: "ID del usuario" },
            challengeId: { type: "string", description: "ID del desafío" },
            challenge:   { $ref: "#/components/schemas/Challenge" },
            status:      { type: "string", enum: ["in_progress", "completed", "failed", "abandoned"] },
            progress:    { type: "number", example: 5000, description: "Progreso actual" },
            goalValue:   { type: "number", example: 10000, description: "Meta (cacheada del desafío)" },
            dailyLogs:   {
              type: "array",
              items: {
                type: "object",
                properties: {
                  date:     { type: "string", example: "2026-04-07" },
                  value:    { type: "number" },
                  source:   { type: "string", enum: ["health_connect", "apple_health", "manual"] },
                  syncedAt: { type: "string", format: "date-time" },
                },
              },
            },
            startedAt:   { type: "string", format: "date-time" },
            completedAt: { type: "string", format: "date-time", nullable: true },
            expiresAt:   { type: "string", format: "date-time", nullable: true },
          },
        },
        // ─── Frase motivacional ───
        MotivationalPhrase: {
          type: "object",
          description: "Frase motivacional del día (solo hay una en la BD).",
          properties: {
            _id:       { type: "string" },
            text:      { type: "string", example: "Cada día es una nueva oportunidad para cambiar el mundo 🌱" },
            author:    { type: "string", example: "Anónimo" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // ─── Configuración de la app ───
        AppSettings: {
          type: "object",
          description: "Configuración general de la aplicación (singleton).",
          properties: {
            achievementsGoal: { type: "integer", example: 50, description: "Meta de progreso general en logros" },
            whatsappNumber:   { type: "string", example: "573187767326", description: "Número de WhatsApp de soporte (con código de país, sin +)" },
            updatedAt:        { type: "string", format: "date-time" },
          },
        },
        // ─── Respuestas comunes ───
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Mensaje de error descriptivo" },
          },
        },
        Message: {
          type: "object",
          properties: {
            message: { type: "string", example: "Operación exitosa" },
          },
        },
      },
    },
  },
  apis: ["./src/docs/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
