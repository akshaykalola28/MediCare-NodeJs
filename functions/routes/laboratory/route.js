const express = require('express');
const route = express.Router();
let { postDoneReportsHandlers, postPendingReportsHandlers, postAddReportHandlers } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
route.post('/doneReports', verifyToken, postDoneReportsHandlers);
route.post('/pendingReports', verifyToken, postPendingReportsHandlers);
route.post('/addReport', verifyToken, postAddReportHandlers);
module.exports = route;