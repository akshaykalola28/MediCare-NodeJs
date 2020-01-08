const express = require('express');
const router = express.Router();
let { postAddMedicinesHandler } = require('./handler');
let { verifyToken } = require('./../../verifyToken');
router.post('/addMedicines', postAddMedicinesHandler);
module.exports = router;