const express = require('express');
const route = express.Router();
let { postCheckHistoryHandler } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
route.post('/checkHistory', verifyToken, postCheckHistoryHandler);
module.exports = route;