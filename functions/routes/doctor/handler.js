const { response } = require('./../../../response');
const { firestore, auth } = require('./../../dbconnection');
const { getNotificationToken } = require('./../../getNotificationToken');
const dateFormat = require('dateformat');

let postAddTreatmentHandler = (req, res, next) => {

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
                firestore.collection("reports").doc(uid).set({ uid: uid });
                let reportRef = firestore.collection("reports").doc(uid);
                delete data['medicalStoreEmail'];
                await getNotificationToken(email, "laboratory", "Generate Report", body).then((result) => {
                    reportRef.collection('data').doc(setDate).set(data).then((result) => {
                        res.status(200).json(response(200, "Added Succesfully"));
                    }).catch((error) => {
                        res.status(401).json(response(401, error + ""));
                    });
                }).catch((error) => {
                    res.status(401).json(response(401, error + ""));
                });
            } else {
                var email = data.medicalStoreEmail;
                let body = "Medicines are added for " + patientName;
                firestore.collection("medicines").doc(uid).set({ uid: uid });
                let medicinesRef = firestore.collection("medicines").doc(uid);
                delete data['laboratoryEmail'];
                await getNotificationToken(email, "medicalStore", "Meicines Aded", body).then((result) => {
                    medicinesRef.collection('data').doc(setDate).set(data).then((result) => {
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
    var sendData = {};
    medicinesHistory(email).then((medicinesData) => {
        sendData['medicinesData'] = medicinesData;
        reportsHistory(email).then((reportsData) => {
            sendData['reportsData'] = reportsData;
            res.status(200).json(response(200, sendData));
        }).catch((error) => {
            res.status(401).json(response(401, error + ""));
        });
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });
};

let medicinesHistory = (email) => {

    var medicinesRecords = [];
    return new Promise(((resolve, reject) => {
        auth.getUserByEmail(email).then((userRecord) => {
            var id = userRecord.uid;
            var medicinesRef = firestore.collection('medicines').doc(id).collection('data');
            medicinesRef.orderBy('date', 'desc').get().then(async (snapshot) => {
                let data = snapshot.docs;
                for (let i of data) {
                    medicinesRecords.push(i.data());
                }
                resolve(medicinesRecords);
                return
            });
        }).catch((error) => {
            reject(error);
            return
        });
    }));
};

let reportsHistory = (email) => {

    var reportsRecords = [];
    return new Promise(((resolve, reject) => {
        auth.getUserByEmail(email).then((userRecord) => {
            var id = userRecord.uid;
            let reportsRef = firestore.collection('reports').doc(id).collection('data');
            reportsRef.orderBy('date', 'desc').get().then(async (snapshot) => {
                let data = snapshot.docs;
                for (let i of data) {
                    reportsRecords.push(i.data());
                }
                resolve(reportsRecords);
                return
            });
        }).catch((error) => {
            reject(error);
            return
        });
    }));
};

module.exports.postAddTreatmentHandler = postAddTreatmentHandler;
module.exports.postCheckHistoryByDoctorHandler = postCheckHistoryByDoctorHandler;
