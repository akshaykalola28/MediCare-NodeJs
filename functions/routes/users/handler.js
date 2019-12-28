const { response } = require("./../../../response");
const { auth, firestore, firebaseAuth } = require("./../../dbconnection");
const { imageUpload } = require("./../../imageUpload");

let postRegisterHandler = async (req, res, next) => {

    var base64str = null;
    let data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber + "",
        password: req.body.password,
        displayName: req.body.displayName,
        user_type: req.body.user_type,
        token: null
    };

    var ref = firestore.collection('users');
    var imageName = data.user_type + data.phoneNumber;
    var fileNameToStore = `${data.user_type}/${imageName}.jpeg`;
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
                if (base64str == null || base64str == "") {
                    data['imageURL'] = null;
                    let userRef = firestore.collection('users').doc(uid);
                    userRef.set(data).then(() => {
                        //res.send("Register Successfully.");
                        res.status(200).json(response(200, "Register Successfully."));
                    });
                } else {
                    var imageURL = imageUpload(fileNameToStore, base64str);
                    imageURL.then(url => {
                        data['imageURL'] = url;
                        let userRef = firestore.collection('users').doc(uid);
                        userRef.set(data).then(() => {
                            res.json(response(200, "Register Successfully."));
                        });
                    }).catch(error => {
                        res.json(response(415, error));
                    });
                }
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
    var notificationToken = null;
    var ref = firestore.collection('users');

    firebaseAuth.signInWithEmailAndPassword(email, password).then((record) => {
        console.log("Token: " + record.user.uid);
        var id = record.user.uid;
        ref.where('uid', '==', id).get().then(snapshot => {
            snapshot.forEach(doc => {
                res.status(200).json(doc.data());
            });
        }).catch((error) => {
            console.log(error);
            res.status(401).json(response(401, error));
        });
        //res.json(response(200, "Login Successfull"));
    }).catch((error) => {
        res.status(401).json(response(401, error));
    });
};

let postDeleteUserHandler = async (req, res, next) => {

    var email = req.body.email;
    var ref = firestore.collection('users');
    //Verify IdToken for deleting the user
    var idToken = req.body.idToken;
    auth.verifyIdToken(idToken).then((decodedToken) => {
        var uid = decodedToken.uid;
        console.log("Uid: " + uid);
        res.json(response(200, "Token is Verified."));
        /*auth.getUserByEmail(email).then((userRecord) => {
            var uid = userRecord.uid;
            auth.deleteUser(uid).then(() => {
                ref.doc(uid).delete().then(() => {
                    res.json(response(true, true, "Delete User Succesfully."));
                }).catch((error) => {
                    res.json(response(false, false, error));
                });
            }).catch((error) => {
                res.json(response(false, false, error));
            });
        }).catch((error) => {
            res.json(response(false, false, error));
        });*/
    }).catch((error) => {
        res.json(response(403, error));
    });
};

module.exports.postRegisterHandler = postRegisterHandler;
module.exports.postLoginHandler = postLoginHandler;
module.exports.postDeleteUserHandler = postDeleteUserHandler;
