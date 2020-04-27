const express = require('express');
const route = express.Router();
let { postCheckHistoryHandler, postBookAppoinmentHandler, postShowAvailableDoctorHandler, postCheckAppointmentStatusHandler } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
route.get('/checkHistory/:patientId', verifyToken, postCheckHistoryHandler);
route.post('/bookAppointment', verifyToken, postBookAppoinmentHandler);
route.post('/showDoctor', verifyToken, postShowAvailableDoctorHandler);
//show status of booked appiontment
route.post('/checkStatus/:patientId/:status', verifyToken, postCheckAppointmentStatusHandler);
module.exports = route;