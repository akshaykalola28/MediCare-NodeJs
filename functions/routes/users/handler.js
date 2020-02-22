const uuid = require('uuid/v4');
const { response } = require("./../../../response");
const { auth, firestore, firebaseAuth } = require("./../../dbconnection");

let postRegisterHandler = async (req, res, next) => {

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
        profileUrl: req.body.profileUrl
    };

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
                    res.status(200).json(response(200, "Register Successfully."));
                });
            }
        }).catch(error => {
            res.status(400).json(response(400, error));
        });
    }).catch((error) => {
        console.log(error);
        res.status(409).json(response(409, "Email or Phone Number already exists."));
    });
};

let postLoginHandler = async (req, res, next) => {

    var email = req.body.email;
    var password = req.body.password;
    var notificationToken = req.body.notificationToken;
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
                res.status(200).json(data);
            });
        }).catch((error) => {
            console.log(error);
            res.status(401).json(response(401, error));
        });
    }).catch((error) => {
        res.status(401).json(response(401, error));
    });
};

let postUserDetailHandler = (req, res, next) => {

    let key = req.params.key;
    var value = req.params.value;
    var ref = firestore.collection('users');
    ref.where(key, '==', value).get().then(async snapshot => {
        if (snapshot.size != 1) {
            res.status(401).send(response(401, 'User not found.'));
            return;
        }
        await snapshot.forEach(doc => {
            var data = doc.data();
            delete data['notificationToken'];
            delete data['token'];
            delete data['password'];
            res.status(200).send(data);
        });
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });
};

let postDeleteUserHandler = async (req, res, next) => {

    var email = req.body.email;
    var ref = firestore.collection('users');
    await auth.getUserByEmail(email).then((userRecord) => {
        var uid = userRecord.uid;
        auth.deleteUser(uid).then(() => {
            ref.doc(uid).delete().then(() => {
                res.status(200).json(response(200, "Delete User Succesfully."));
            }).catch((error) => {
                res.status(401).json(response(401, error));
            });
        }).catch((error) => {
            res.status(401).json(response(401, error));
        });
    }).catch((error) => {
        res.status(401).json(response(401, error));
    });
};

let postForgotPasswordHandler = (req, res, next) => {

    var email = req.body.email;
    firebaseAuth.sendPasswordResetEmail(email).then(() => {
        res.status(200).json(response(200, "Email Sent."));
    }).catch((error) => {
        res.status(401).json(response(401, error));
    });
};

module.exports.postRegisterHandler = postRegisterHandler;
module.exports.postLoginHandler = postLoginHandler;
module.exports.postDeleteUserHandler = postDeleteUserHandler;
module.exports.postUserDetailHandler = postUserDetailHandler;
module.exports.postForgotPasswordHandler = postForgotPasswordHandler;
