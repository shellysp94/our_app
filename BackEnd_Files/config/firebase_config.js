var admin = require("firebase-admin");

var serviceAccount = require("../our-final-project-app-firebase.json");



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

module.exports.admin = admin