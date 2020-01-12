const express = require('express');
const userRoute = require('./functions/routes/users/route');
const docotorRoute = require('./functions/routes/doctor/route');
const laboratoryRoute = require('./functions/routes/laboratory/route');
const medicalRoute = require('./functions/routes/medicalStore/route');
const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.get('/', (req, res) => {
	res.status(200).send('Hello World!').end();
});

app.get('/demo', (req, res) => {
	res.send('I updated.');
});

app.use('/user', userRoute);
app.use('/doctor', docotorRoute);
app.use('/medicalStore', medicalRoute);
app.use('/laboratory', laboratoryRoute);

app.listen(8080, () => {
	console.log('Server Started.');
});
