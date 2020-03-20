const express = require('express');
const route = express.Router();
let { postCheckHistoryHandler, postBookAppoinmentHandler } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
route.get('/checkHistory/:patientId', verifyToken, postCheckHistoryHandler);
route.post('/bookAppointment', verifyToken, postBookAppoinmentHandler);
//show available doctors in this application
module.exports = route;