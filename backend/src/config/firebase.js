const admin = require("firebase-admin");

let firebaseApp = null;

function getFirebaseAdmin() {
  if (firebaseApp) return firebaseApp;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    console.warn("⚠️  FIREBASE_SERVICE_ACCOUNT no configurada — push notifications deshabilitadas");
    return null;
  }

  try {
    const serviceAccount = JSON.parse(raw);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin inicializado");
    return firebaseApp;
  } catch (err) {
    console.error("❌ Error inicializando Firebase Admin:", err.message);
    return null;
  }
}

module.exports = { getFirebaseAdmin };
