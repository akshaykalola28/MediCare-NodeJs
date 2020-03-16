var express = require('express');
var { postRegisterHandler } = require('./../../functions/routes/users/handler');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/signup', (req, res, next) => {
  res.render('signup', { title: 'SignUp' });
});

router.get('/login', (req, res, next) => {
  res.render('login', { title: 'LogIn' });
});

router.post('/signup', postRegisterHandler);

module.exports = router;
