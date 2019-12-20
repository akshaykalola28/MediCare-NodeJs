const express = require('express');
const router = express.Router();
let { postRegisterHandler, postLoginHandler, postDeleteUserHandler } = require('./handler');
router.post('/register', postRegisterHandler);
router.post('/login', postLoginHandler);
router.post('/delete', postDeleteUserHandler);
module.exports = router;