const express = require('express');
const route = express.Router();
let { postDoneReportsHandlers, postPendingReportsHandlers } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
route.post('/doneReports', verifyToken, postDoneReportsHandlers);
route.post('/pendingReports', verifyToken, postPendingReportsHandlers);
module.exports = route;