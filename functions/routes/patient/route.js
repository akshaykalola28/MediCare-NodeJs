const express = require('express');
const route = express.Router();
let { postCheckHistoryHandler, postBookAppoinmentHandler, postShowAvailableDoctorHandler } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
route.get('/checkHistory/:patientId', verifyToken, postCheckHistoryHandler);
route.post('/bookAppointment', verifyToken, postBookAppoinmentHandler);
//show available doctors in this application
route.post('/checkStatus', verifyToken, postShowAvailableDoctorHandler);
//show status of booked appiontment
module.exports = route;