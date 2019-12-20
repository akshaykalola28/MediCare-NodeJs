const { response } = require("./../../../response");
const { auth, firestore, firebaseAuth } = require("./../../dbconnection");
const { imageUpload } = require("./../../imageUpload");

let postRegisterHandler = async (req, res, next) => {

    var base64str = null;
    let data = {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        email: req.body.email.trim(),
        phoneNumber: req.body.phoneNumber + "".trim(),
        password: req.body.password,
        displayName: req.body.displayName,
        user_type: req.body.user_type.trim(),
        token: null,
        address: [
            {
                address: req.body.address,
                pincode: req.body.pincode.trim()
            }
        ]
    };

    var ref = firestore.collection(data.user_type);
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
                res.json(response(true, true, "ER_DUP_ENTRY"));
            } else {
                if (base64str == null || base64str == "") {
                    data['imageURL'] = null;
                    let userRef = firestore.collection(data.user_type).doc(uid);
                    userRef.set(data).then(() => {
                        res.json(response(true, true, "Register Successfully."));
                    });
                } else {
                    var imageURL = imageUpload(fileNameToStore, base64str);
                    imageURL.then(url => {
                        data['imageURL'] = url;
                        let userRef = firestore.collection(data.user_type).doc(uid);
                        userRef.set(data).then(() => {
                            res.json(response(true, true, "Register Successfully."));
                        });
                    }).catch(error => {
                        res.json(response(false, false, error));
                    });
                }
            }
        }).catch(error => {
            res.json(false, false, error);
        });
    }).catch((error) => {
        res.json(response(false, false, error));
    });
};

let postLoginHandler = async (req, res, next) => {

    var email = req.body.email;
    var password = req.body.password;
    var notificationToken = null;

    firebaseAuth.signInWithEmailAndPassword(email, password).then((record) => {
        console.log("Token: " + record.user.displayName);
        res.json(response(true, true, "Login Successfull"));
    }).catch((error) => {
        res.json(response(false, false, error));
    });
};

let postDeleteUserHandler = async (req, res, next) => {

    var email = req.body.email;
    var ref = firestore.collection(req.body.user_type);
    //Verify IdToken for deleting the user
    var idToken = req.body.idToken;
    auth.verifyIdToken(idToken).then((decodedToken) => {
        var uid = decodedToken.uid;
        console.log("Uid: " + uid);
        res.json(response(true, true, "Token is Verified."));
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
        res.json(response(false, false, error));
    });
};

module.exports.postRegisterHandler = postRegisterHandler;
module.exports.postLoginHandler = postLoginHandler;
module.exports.postDeleteUserHandler = postDeleteUserHandler;
