var express = require('express');
const uuid = require('uuid/v4');

const { response } = require("./../../response");
const { auth, firestore, firebaseAuth } = require("./../../functions/dbconnection");

var { postRegisterHandler } = require('./../../functions/routes/users/handler');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'MediCare Application' });
});

router.get('/signup', (req, res, next) => {
    res.render('signup', { title: 'SignUp' });
});

router.post('/signup', async (req, res, next) => {
    let data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber + "",
        password: req.body.password,
        displayName: req.body.displayName,
        user_type: req.body.user_type,
        token: null,
        notificationToken: null,
        profileUrl: req.body.profileUrl || ""
    };
    console.log(data)

    var ref = firestore.collection('users');
    var userExists;
    await auth.createUser({
        email: req.body.email,
        phoneNumber: '+91' + req.body.phoneNumber,
        password: req.body.password,
        displayName: req.body.displayName
    }).then(async (userRecord) => {
        var uid = userRecord.uid;
        data['uid'] = uid;
        await ref.where('uid', '==', uid).get().then(snapshot => {
            userExists = snapshot.size;
            if (userExists && userExists > 0) {
                res.status(409).json(response(409, "ER_DUP_ENTRY"));
            } else {
                let userRef = firestore.collection('users').doc(uid);
                userRef.set(data).then(() => {
                    res.render('index', {
                        title: 'MediCare',
                        message: 'Registration Succesfully'
                    })
                });
            }
        }).catch(error => {
            res.render('signup', {
                message: error + ""
            })
        });
    }).catch((error) => {
        res.render('signup', {
            message: "Email or Phone Number already exists."
        })
        console.log(error);
    });
});

router.get('/login', (req, res, next) => {
    res.render('login', { title: 'LogIn' });
});

router.post('/signup', postRegisterHandler);

module.exports = router;