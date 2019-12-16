const express = require('express');
const router = express.Router();
let { postRegisterHandler } = require('./handler');
router.post('/register', postRegisterHandler);
module.exports = router;