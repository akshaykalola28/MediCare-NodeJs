const express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const userRoute = require('./functions/routes/users/route');
const docotorRoute = require('./functions/routes/doctor/route');
const laboratoryRoute = require('./functions/routes/laboratory/route');
const medicalRoute = require('./functions/routes/medicalStore/route');
const patientRoute = require('./functions/routes/patient/route');
const hospitalRoute = require('./functions/routes/hospital/route');
const app = express();

var indexRouter = require('./web/routes/index');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'web/public')));

app.get('/demo', (req, res) => {
	res.send('I updated.');
});

app.use('/', indexRouter);

app.use('/user', userRoute);
app.use('/doctor', docotorRoute);
app.use('/medicalStore', medicalRoute);
app.use('/laboratory', laboratoryRoute);
app.use('/patient', patientRoute);
app.use('/hospital', hospitalRoute);

app.listen(8080, () => {
	console.log('Server Started.');
});