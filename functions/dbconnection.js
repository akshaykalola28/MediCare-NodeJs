const admin = require('firebase-admin');
const firebase = require('firebase');
const serviceAccount = require("./../serviceAccountKey.json");

admin.initializeApp( {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://medicare-888f7.firebaseio.com"
});
const config = {
    apiKey: "AIzaSyD6UtxwTX-x4GzWbxwKqIdDog47b6TITuQ",
    authDomain: "medicare-888f7.firebaseapp.com",
    projectId: "medicare-888f7",
    appID: "1:576403818114:android:c2d0e43266455b9aa9969b"
};
firebase.initializeApp(config);

const firebaseAuth = firebase.auth();
const auth = admin.auth();
const firestore = admin.firestore();
const storage = admin.storage();
const messaging = admin.messaging();

module.exports.auth = auth;
module.exports.firestore = firestore;
module.exports.storage = storage;
module.exports.messaging = messaging;
module.exports.firebaseAuth = firebaseAuth;