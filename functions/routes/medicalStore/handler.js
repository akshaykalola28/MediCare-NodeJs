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

module.exports.postPendingMedicinesHandlers = postPendingMedicinesHandlers;
module.exports.postDoneMedicinesHandlers = postDoneMedicinesHandlers;