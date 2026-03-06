const admin = require("firebase-admin");

// Prevent re-initialization (important for serverless environments)
if (!admin.apps.length) {
  try {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // On Vercel: env var contains the JSON string
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      // Locally: use the service key file
      serviceAccount = require("./firebaseServiceKey.json");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin Initialized Successfully");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error.message);
    console.log(
      "Ensure FIREBASE_SERVICE_ACCOUNT env var is set in Vercel (as valid JSON)."
    );
  }
}

module.exports = admin;