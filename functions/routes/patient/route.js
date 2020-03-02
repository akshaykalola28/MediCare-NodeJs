const express = require('express');
const route = express.Router();
let { postCheckHistoryHandler } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
route.get('/checkHistory/:patientId', verifyToken, postCheckHistoryHandler);
module.exports = route;