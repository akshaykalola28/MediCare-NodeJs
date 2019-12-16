const { response } = require("./../../../response");
const { auth, firestore } = require("./../../dbconnection");
const { imageUpload } = require("./../../imageUpload");

let postRegisterHandler = async (req, res, next) => {

    var base64str = null;
    let data = {
        uid: null,
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        email: req.body.email.trim(),
        phoneNumber: req.body.phoneNumber + "".trim(),
        password: req.body.password.trim(),
        displayName: req.body.displayName.trim(),
        user_type: req.body.user_type.trim(),
        token: null,
        address: [
            {
                address: req.body.address.trim(),
                pincode: req.body.pincode.trim()
            }
        ]
    };

    var ref = firestore.collection(data.user_type);
    var imageName = data.user_type + data.phoneNumber;
    var fileNameToStore = `${data.user_type}/${imageName}.jpeg`;
    var userExists;
    await ref.where('phoneNumber', '==', data.phoneNumber).get().then(snapshot => {
        userExists = snapshot.size;
        if (userExists && userExists > 0) {
            res.json(response(true, true, "ER_DUP_ENTRY"));
        } else {
            if (base64str == null || base64str == "") {
                data['imageURL'] = null;
                let userRef = firestore.collection(data.user_type).doc(data.phoneNumber);
                userRef.set(data).then(() => {
                    auth.createUser({
                        email: req.body.email,
                        phoneNumber: '+91' + req.body.phoneNumber,
                        password: req.body.password,
                        displayName: req.body.displayName
                    }).then((userRecord) => {
                        var uid = userRecord.uid;
                        userRef.update('uid', uid).then(() => {
                            res.json(response(true, true, "Register Successfully"));
                        }).catch(() => {
                            res.json(response(false, false, "uid not updated."));
                        });
                    }).catch((error) => {
                        res.json(response(false, false, error));
                    });
                });
            } else {
                var imageURL = imageUpload(fileNameToStore, base64str);
                imageURL.then(url => {
                    data['imageURL'] = url;
                    let userRef = firestore.collection(data.user_type).doc(data.phoneNumber);
                    userRef.set(data).then(() => {
                        auth.createUser({
                            email: req.body.email,
                            phoneNumber: req.body.phoneNumber,
                            password: req.body.password,
                            displayName: req.body.displayName
                        }).then(() => {
                            var uid = userRecord.uid;
                            userRef.update('uid', uid).then(() => {
                                res.json(response(true, true, "Register Successfully"));
                            }).catch(() => {
                                res.json(response(false, false, "uid not updated."));
                            });
                        }).catch((error) => {
                            res.json(response(false, false, error));
                        });
                    });
                }).catch(error => {
                    res.json(response(false, false, error));
                });
            }
        }
    }).catch(error => {
        res.json(false, false, error);
    });
};

module.exports.postRegisterHandler = postRegisterHandler;