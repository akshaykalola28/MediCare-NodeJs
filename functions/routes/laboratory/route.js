const express = require('express');
const route = express.Router();
let { postPendingReportsHandlers, postAddReportHandlers } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
route.get('/reports/:status', verifyToken, postPendingReportsHandlers);
route.post('/addReport', verifyToken, postAddReportHandlers);
module.exports = route;