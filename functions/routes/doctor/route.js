const express = require('express');
const router = express.Router();
let { postAddTreatmentHandler, postCheckHistoryByDoctorHandler, postRequestReportHandler } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
router.post('/addTreatment', verifyToken, postAddTreatmentHandler);
router.get('/checkHistory/:patientId', verifyToken, postCheckHistoryByDoctorHandler);
router.post('/reqReport', verifyToken, postRequestReportHandler);
module.exports = router;