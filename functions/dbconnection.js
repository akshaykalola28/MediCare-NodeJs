const admin = require('firebase-admin');
const serviceAccount = require("./../serviceAccountKey.json");

admin.initializeApp( {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://medicare-888f7.firebaseio.com"
});

const auth = admin.auth();
const firestore = admin.firestore();
const storage = admin.storage();

module.exports.auth = auth;
module.exports.firestore = firestore;
module.exports.storage = storage;