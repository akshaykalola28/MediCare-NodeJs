const express = require('express');
const router = express.Router();
let { postRegisterHandler, postLoginHandler, postDeleteUserHandler, postRefreshTokenHandler } = require('./handler');
router.post('/register', postRegisterHandler);
router.post('/login', postLoginHandler);
router.post('/delete', postDeleteUserHandler);
router.post('/refresh', postRefreshTokenHandler);
module.exports = router;