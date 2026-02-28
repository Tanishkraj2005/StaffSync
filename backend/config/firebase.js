const admin = require("firebase-admin");

try {
  let serviceAccount;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // We wrapped this in a try-catch because on Render this file won't exist
    // and we don't want the entire server to crash immediately on boot.
    serviceAccount = require("./firebaseServiceKey.json");
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin Initialized Successfully");
  }
} catch (error) {
  console.log("Firebase Admin warning: Service account not found or invalid.");
  console.log("If on Render, please ensure FIREBASE_SERVICE_ACCOUNT env var is set.");
}

module.exports = admin;