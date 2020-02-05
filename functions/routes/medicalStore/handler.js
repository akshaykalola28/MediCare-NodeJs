const { response } = require('./../../../response');
const { firestore, auth } = require('./../../dbconnection');

let postPendingMedicinesHandlers = (req, res, next) => {

    var email = req.body.email;
    var sendData = {};
    medicines(email, "pending").then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });

};

let postDoneMedicinesHandlers = (req, res, next) => {

    var email = req.body.email;
    var sendData = {};
    medicines(email, "done").then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });

};

let medicines = (email, status) => {

    return new Promise(((resolve, reject) => {
        var medicinesRecord = [];
        let medicinesRef_1 = firestore.collection('reports');
        medicinesRef_1.get().then(async snapshot => {
            let data = snapshot.docs;
            for (let i of data) {
                var patientId = i.data().patientId;
                let medicinesRef_2 = firestore.collection('medicines').doc(patientId).collection('data');
                await medicinesRef_2.where('medicalStoreEmail', '==', email).where('collectingStatus', '==', status).get().then(querySnapshot => {
                    for (let j of querySnapshot.docs) {
                        medicinesRecord.push(j.data());
                    }
                }).catch((error) => {
                    reject(error);
                    return
                });
            }
            resolve(medicinesRecord);
            return
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