const express = require('express');
const route = express.Router();
let { postCheckAppointmentStatusHandler, postIsAppointmentApprovedHandler } = require("./handler");
let { verifyToken } = require("./../../verifyToken");
route.post('/checkStatus/:hospitalId/:status', verifyToken, postCheckAppointmentStatusHandler);
route.post('/appointment', verifyToken, postIsAppointmentApprovedHandler);
module.exports = route;