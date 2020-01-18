const { response } = require('./../../../response');
const { firestore, auth } = require('./../../dbconnection');

let postPendingMedicinesHandlers = (req, res, next) => {

    var email = req.body.email;
    var sendData = {};
    medicines(email, "pending").then((data) => {
        res.status(200).json(response(200, data));
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });

};

let postDoneMedicinesHandlers = (req, res, next) => {

    var email = req.body.email;
    var sendData = {};
    medicines(email, "done").then((data) => {
        res.status(200).json(response(200, data));
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });

};

let medicines = (email, status) => {

    return new Promise(((resolve, reject) => {
        var medicinesRecord = [];
        auth.getUserByEmail(email).then((userRecord) => {
            let uid = userRecord.uid;
            let medicinesRef = firestore.collection('medicines').doc(uid).collection('data');
            medicinesRef.where('collectingStatus', '==', status).get().then(snapshot => {
                let data = snapshot.docs;
                for (let i of data) {
                    medicinesRecord.push(i.data());
                }
                resolve(medicinesRecord);
                return
            });
        }).catch((error) => {
            reject(error);
            return
        });
    }));
};

//add available medicines in medical store handler
let postAddAvailableMedicineshandlers = (req, res, next) => {

    var addData = req.body;
    var laboratoryId = req.body.laboratoryId;
    var ref = firestore.collection('availableMeicines');
    ref.doc(laboratoryId).set(addData).then((result) => {
        res.status(200).json(response(200, "Added succesfully."));
    }).catch(error => {
        res.status(401).json(response(401, error));
    });
};

//see available medicines in medical store handler
let postSeeAvailableMedicineshandlers = (req, res, next) => {

    var sendData = {};
    var laboratoryId = req.body.laboratoryId;
    var ref = firestore.collection('availableMeicines');
    ref.where('laboratoryId', '==', laboratoryId).get().then(async snapshot => {
        await snapshot.forEach(doc => {
            sendData = doc.data();
        });
        delete sendData['laboratoryId'];
        res.status(200).json(response(200, sendData));
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });
};

module.exports.postPendingMedicinesHandlers = postPendingMedicinesHandlers;
module.exports.postDoneMedicinesHandlers = postDoneMedicinesHandlers;
module.exports.postAddAvailableMedicineshandlers = postAddAvailableMedicineshandlers;
module.exports.postSeeAvailableMedicineshandlers = postSeeAvailableMedicineshandlers;