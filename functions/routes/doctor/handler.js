const { response } = require('./../../../response');
const { firestore, auth } = require('./../../dbconnection');
const { getNotificationToken } = require('./../../getNotificationToken');
const dateFormat = require('dateformat');

let postAddMedicinesHandler = (req, res, next) => {

    var date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    var setDate = dateFormat(date, 'yyyymmddHHMMss'); //medicines data ID
    var data = req.body;
    data['mId'] = setDate;
    data['date'] = date;
    var uid = data['patientid'];
    var checkRef = firestore.collection('users'); //For checking that patient exists or not.
    checkRef.where('uid', '==', uid).where('user_type', '==', "patient").get().then(async (snapshot) => {
        if (snapshot.size != 1) {
            res.status(409).json(response(409, "Patient does not exists."));
        }
        else {
            var patientName;
            await snapshot.forEach(doc => {
                patientName = doc.data().displayName;
            });
            data['patientName'] = patientName;
            if (data.laboratoryEmail != null) {
                var email = data.laboratoryEmail;
                let body = "Generate report for " + patientName;
                let reportRef = firestore.collection("reports");
                delete data['medicalStoreEmail'];
                await getNotificationToken(email, "laboratory", "Generate Report", body).then((result) => {
                    reportRef.doc(uid).collection('data').doc(setDate).set(data).then((result) => {
                        res.status(200).json(response(200, "Added Succesfully"));
                    }).catch((error) => {
                        res.status(401).json(response(401, error));
                    });
                }).catch((error) => {
                    res.status(401).json(response(401, error));
                });
            } else {
                var email = data.medicalStoreEmail;
                let body = "Medicines are added for " + patientName;
                let medicinesRef = firestore.collection("medicines");
                delete data['laboratoryEmail'];
                await getNotificationToken(email, "medicalStore", "Meicines Aded", body).then((result) => {
                    medicinesRef.doc(uid).collection('data').doc(setDate).set(data).then((result) => {
                        res.status(200).json(response(200, "Added Succesfully"));
                    }).catch((error) => {
                        res.status(401).json(response(401, error));
                    });
                }).catch((error) => {
                    res.status(401).json(response(401, error));
                });
            }
        }
    }).catch((error) => {
        res.status(401).json(response(401, error));
    });
};

let postCheckHistoryByDoctorHandler = (req, res, next) => {

    var email = req.body.email;
    auth.getUserByEmail(email).then((userRecord) => {
        var uid = userRecord.uid;
        var historyRef = firestore.collection('medicines');
    }).catch((error) => {
        res.status(401).json(response(401, error));
    });
};

module.exports.postAddMedicinesHandler = postAddMedicinesHandler;
