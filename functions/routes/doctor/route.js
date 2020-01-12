const express = require('express');
const router = express.Router();
let { postAddTreatmentHandler, postCheckHistoryByDoctorHandler } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
router.post('/addTreatment', verifyToken, postAddTreatmentHandler);
router.post('/checkHistory', verifyToken, postCheckHistoryByDoctorHandler);
module.exports = router;