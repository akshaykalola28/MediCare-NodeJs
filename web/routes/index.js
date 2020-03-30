var express = require('express');
const { response } = require("./../../response");
const { auth, firestore, firebaseAuth } = require("./../../functions/dbconnection");
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('hospital');
});

router.get('/hospital', (req, res, next) => {
    res.render('hospital');
});

router.post('/hospital', async (req, res, next) => {
    let data = {
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
        res.render('hospital', {
            message: "Your password and confirm password does not match."
        })
    } else {
        var ref = firestore.collection('users');
        var userExists;
        await ref.where('displayName', '==', req.body.displayName).get().then(async checkSnapshot => {
            userExists = checkSnapshot.size;
            if (userExists && userExists > 0) {
                res.status(409).json(response(409, "Display Name already exists."));
            } else {
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
                                res.render('hospital', {
                                    message: 'Registration Succesfully.'
                                })
                            });
                        }
                    }).catch(error => {
                        res.render('hospital', {
                            message: error + ""
                        })
                    });
                }).catch((error) => {
                    res.render('hospital', {
                        message: "Email or Phone Number already exists."
                    })
                    console.log(error);
                });
            }
        });
    }
});

router.get('/doctor', (req, res, next) => {
    res.render('doctor');
});

router.post('/doctor', async (req, res, next) => {
    addData(req.body).then(result => {
        res.render('doctor', { message: result });
    }).catch((error) => {
        res.render('doctor', { message: error });
    });
});

router.get('/medicalStore', (req, res, next) => {
    res.render('medicalStore');
});

router.post('/medicalStore', async (req, res, next) => {
    addData(req.body).then(result => {
        res.render('medicalStore', { message: result });
    }).catch((error) => {
        res.render('medicalStore', { message: error });
    });
});

router.get('/laboratory', (req, res, next) => {
    res.render('laboratory');
});

router.post('/laboratory', async (req, res, next) => {
    addData(req.body).then(result => {
        res.render('laboratory', { message: result });
    }).catch((error) => {
        res.render('laboratory', { message: error });
    });
});

let addData = (body) => {

    return new Promise((async (resolve, reject) => {
        let data = {
            hospitalName: body.hospitalName,
            email: body.email,
            phoneNumber: body.phoneNumber + "",
            password: body.password,
            displayName: body.displayName,
            user_type: body.user_type,
            token: null,
            notificationToken: null,
            profileUrl: body.profileUrl || ""
        };
        console.log(data)
        let cnfpassword = body.cnfpassword;
        if (data.password != cnfpassword) {
            reject("Your password and confirm password does not match.");
            return
        } else {
            var ref1 = firestore.collection('users');
            await ref1.where('displayName', '==', data.hospitalName).get().then(async hospitalSnapshot => {
                await hospitalSnapshot.forEach(result => {
                    data['hospitalId'] = result.data()['uid'];
                });
                console.log(data);
                var ref2 = firestore.collection('users');
                var userExists;
                await auth.createUser({
                    email: req.body.email,
                    phoneNumber: '+91' + req.body.phoneNumber,
                    password: req.body.password,
                    displayName: req.body.displayName
                }).then(async (userRecord) => {
                    var uid = userRecord.uid;
                    data['uid'] = uid;
                    await ref2.where('uid', '==', uid).get().then(snapshot => {
                        userExists = snapshot.size;
                        if (userExists && userExists > 0) {
                            res.status(409).json(response(409, "ER_DUP_ENTRY"));
                        } else {
                            let userRef = firestore.collection('users').doc(uid);
                            userRef.set(data).then(() => {
                                resolve("Doctor details added Succesfully.");
                                return
                            });
                        }
                    }).catch(error => {
                        reject(error + "");
                        return
                    });
                }).catch((error) => {
                    console.log(error);
                    reject("Email or Phone Number already exists.");
                    return
                });
            }).catch((error) => {
                console.log(error);
                reject("Hospital Name is invalid.");
                return
            });
        }
    }));
};

module.exports = router;