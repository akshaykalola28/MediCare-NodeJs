const express = require('express');

const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

app.get('/', (req, res) => {
	res.status(200).send('Hello World!').end();
});

app.get('/demo', (req, res) => {
	res.send('Demo');
});

app.listen(8080, () => {
	console.log('Server Started.');
});
