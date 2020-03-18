var express = require('express');
const uuid = require('uuid/v4');

const { response } = require("./../../response");
const { auth, firestore, firebaseAuth } = require("./../../functions/dbconnection");

var { postRegisterHandler } = require('./../../functions/routes/users/handler');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('login', { title: 'MediCare Application' });
});

router.get('/index', (req, res, next) => {
    res.render('index', { title: 'MediCare' });
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
    let cnfpassword = req.body.cnfpassword;
    if (req.body.password != cnfpassword) {
        res.render('signup', {
            message: "Your password and confirm password does not match."
        })
    } else {
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
                        res.render('login', {
                            title: 'MediCare',
                            message: 'Registration Succesfully. Please, LogIn'
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
    }
});

router.get('/login', (req, res, next) => {
    res.render('login', { title: 'LogIn' });
});

router.post('/login', async (req, res, next) => {

    var email = req.body.email;
    var password = req.body.password;
    console.log(email + " " + password);
    var notificationToken = null;
    var ref = firestore.collection('users');

    await firebaseAuth.signInWithEmailAndPassword(email, password).then(async (record) => {
        var id = record.user.uid;
        await ref.where('uid', '==', id).get().then(async snapshot => {
            let idToken = uuid();
            await ref.doc(id).update('token', idToken, 'notificationToken', notificationToken);
            snapshot.forEach(doc => {
                var data = doc.data();
                data['token'] = idToken;
                delete data['password'];
                delete data['notificationToken'];
                res.render('index', {
                    message: JSON.stringify(data)
                })
            });
        }).catch((error) => {
            res.render('login', {
                message: "You have not User ID not found."
            })
            console.log(error);
        });
    }).catch((error) => {
        res.render('login', {
            message: "Incorrect Email and Password."
        });
        console.log(error);
    });
});

module.exports = router;