const express = require('express');
const router = express.Router();
let { postAddMedicinesHandler } = require('./handler');
router.post('/addMedicines', postAddMedicinesHandler);
module.exports = router;