const express = require('express');
const route = express.Router();
let { postCheckAppointmentStatusHandler } = require("./handler");
let { verifyToken } = require("./../../verifyToken");
route.post('/checkStatus/:hospitalId/:status', verifyToken, postCheckAppointmentStatusHandler);
module.exports = route;