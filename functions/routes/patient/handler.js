const { response } = require('./../../../response');
const { auth, firestore } = require('./../../dbconnection');
const dateFormat = require('dateformat');

let postCheckHistoryHandler = (req, res, next) => {

    var uid = req.params.patientId;
    console.log(uid);
    var sendData = {};
    medicinesHistory(uid).then((medicinesData) => {
        sendData['medicinesData'] = medicinesData;
        reportsHistory(uid).then((reportsData) => {
            sendData['reportsData'] = reportsData;
            res.status(200).json(sendData);
        }).catch((error) => {
            res.status(401).json(response(401, error + ""));
        });
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });
};

let medicinesHistory = (id) => {

    var medicinesRecords = [];
    return new Promise(((resolve, reject) => {
        var medicinesRef = firestore.collection('medicines').doc(id).collection('data');
        medicinesRef.orderBy('date', 'desc').get().then(async (snapshot) => {
            let data = snapshot.docs;
            for (let i of data) {
                medicinesRecords.push(i.data());
            }
            resolve(medicinesRecords);
            return
        }).catch((error) => {
            reject(error);
            return
        });
    }));
};

let reportsHistory = (id) => {

    var reportsRecords = [];
    return new Promise(((resolve, reject) => {
        let reportsRef = firestore.collection('reports').doc(id).collection('data');
        reportsRef.orderBy('date', 'desc').get().then(async (snapshot) => {
            let data = snapshot.docs;
            for (let i of data) {
                reportsRecords.push(i.data());
            }
            resolve(reportsRecords);
            return
        }).catch((error) => {
            reject(error);
            return
        });
    }));
};

let postBookAppoinmentHandler = async (req, res, next) => {

    let data = {
        patientId: req.body.patientId,
        doctorId: req.body.doctorId,
        hospitalId: req.body.hospitalId
    };
    var date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    data['date'] = date;
    let checkRef_1 = firestore.collection('users');
    await checkRef_1.where('uid', '==', data.patientId).where('user_type', '==', "patient").get().then(async snapshot => {
        if (snapshot.size != 1) {
            res.status(409).json(response(409, "Patient does not exists."));
        } else {
            var patientName;
            await snapshot.forEach(doc => {
                patientName = doc.data().displayName;
            });
            data['patientName'] = patientName;
            var checkRef_2 = firestore.collection('users');
            await checkRef_2.where('uid', '==', data.doctorId).where('user_type', '==', 'doctor').where('hospitalId', '==', data.hospitalId).get().then(async (querySnapshot) => {
                console.log(querySnapshot.size);
                if (querySnapshot.size != 1) {
                    res.status(409).json(response(409, "Doctor or Hospital does not exists."));
                } else {
                    var doctorName;
                    var hospitalName;
                    await querySnapshot.forEach(result => {
                        doctorName = result.data().displayName;
                        console.log(doctorName)
                        hospitalName = result.data().hospitalName;
                    });
                    data['doctorName'] = doctorName;
                    data['hospitalName'] = hospitalName; firestore.collection("appointment").doc(data.hospitalId).set({ hospitalId: data.hospitalId });
                    let appointmentRef = firestore.collection("appointment").doc(data.hospitalId);
                    appointmentRef.collection('data').add(data).then((result) => {
                        res.status(200).json(response(200, "Appointment Booked Succesfully"));
                    }).catch((error) => {
                        console.log(error);
                        res.status(401).json(response(401, error + ""));
                    });
                }
            }).catch((error) => {
                res.status(401).json(response(401, error + ""));
            });
        }
    });
};

let postShowAvailableDoctorHandler = async (req, res, next) => {

    const sendData = [];
    let ref = firestore.collection('users');
    await ref.where('user_type', '==', 'doctor').get().then(async value => {
        let data = value.docs;
        for (let i of data) {
            sendData.push(i.data())
        }
        res.status(200).send(sendData);
    }).catch((error) => {
        res.status(404).json(response(404, error + ""));
    });
};

let getDoctor = (hospitalName) => {

    const getData = [];
    return new Promise(((resolve, reject) => {
        let ref = firestore.collection('users')
        ref.where('user_type', '==', 'doctor').where('hospitalName', '==', hospitalName).get().then(async (snapshot) => {
            let data = snapshot.docs;
            for (let i of data) {
                getData.push(i.data());
            }
            resolve(getData);
            return
        }).catch((error) => {
            reject(error);
            return
        });
    }));
};

let postCheckAppointmentStatusHandler = async (req, res, next) => {

    var uid = req.params.patientId;
    var status = req.params.status;
    let ref_1 = firestore.collection('appointment');
    await ref_1.get().then(async (hIdSnapshot) => {
        let sendData = [];
        let data = hIdSnapshot.docs;
        for (let i of data) {
            let hId = i.data()['hospitalId'];
            let ref_2 = firestore.collection('appointment').doc(hId).collection('data');
            await ref_2.where('patientId', '==', uid).where('status', '==', status).orderBy('date', 'asc').get().then(async (valueSnapshot) => {
                await valueSnapshot.forEach(result => {
                    sendData.push(result.data());
                });
            });
        }
        res.status(200).send(sendData);
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });
};

let postAddPastMedicinesRecordsHandler = (req, res, next) => {

    var data = req.body;
    var setDate = dateFormat(data['date'], "yyyymmddHHMMss");
    var uid = data['patientId'];
    data['treatmentId'] = setDate;
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
            firestore.collection("medicines").doc(uid).set({ patientId: uid });
            let medicinesRef = firestore.collection("medicines").doc(uid);
            medicinesRef.collection('data').doc(setDate).set(data).then((result) => {
                res.status(200).json(response(200, "Added Succesfully"));
            }).catch((error) => {
                console.log(error);
                res.status(401).json(response(401, error + ""));
            });
        }
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });
};

let postAddPastReportsRecordsHandler = (req, res, next) => {

    var data = req.body;
    var setDate = dateFormat(data['date'], "yyyymmddHHMMss");
    var uid = data['patientId'];
    data['reportId'] = setDate;
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
            firestore.collection("reports").doc(uid).set({ patientId: uid });
            let medicinesRef = firestore.collection("reports").doc(uid);
            medicinesRef.collection('data').doc(setDate).set(data).then((result) => {
                res.status(200).json(response(200, "Added Succesfully"));
            }).catch((error) => {
                console.log(error);
                res.status(401).json(response(401, error + ""));
            });
        }
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });
};

module.exports.postCheckHistoryHandler = postCheckHistoryHandler;
module.exports.postBookAppoinmentHandler = postBookAppoinmentHandler;
module.exports.postShowAvailableDoctorHandler = postShowAvailableDoctorHandler;
module.exports.postCheckAppointmentStatusHandler = postCheckAppointmentStatusHandler;
module.exports.postAddPastMedicinesRecordsHandler = postAddPastMedicinesRecordsHandler;
module.exports.postAddPastReportsRecordsHandler = postAddPastReportsRecordsHandler;