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
            await checkRef_2.where('uid', '==', data.doctorId).where('user_type', '==', 'doctor').get().then((querySnapshot) => {
                if (querySnapshot.size != 1) {
                    res.status(409).json(response(409, "Doctor does not exists."));
                } else {
                    firestore.collection("appointment").doc(data.hospitalId).set({ hospitalId: data.hospitalId });
                    let appointmentRef = firestore.collection("appointment").doc(data.hospitalId);
                    appointmentRef.collection('data').add(data).then((result) => {
                        res.status(200).json(response(200, "Appointment Booked Succesfully"));
                    }).catch((error) => {
                        console.log(error);
                        res.status(401).json(response(401, error + ""));
                    });
                }
            }).catch((error) => {
                res.status(401).json(response(401, error));
            });
        }
    });
};

let postShowAvailableDoctorHandler = async (req, res, next) => {
/*
    var sendData = [];
    var getData = {};
    var getDoctorData = [];
    let ref = firestore.collection('users');
    await ref.where('user_type', '==', 'hospital').get().then(async value => {
        let data = value.docs;
        for (let i of data) {
            //console.log(i.data()['displayName']);
            await getDoctor(i.data()['displayName']).then((getResult) => {
                //console.log("1");
                getData['hospitalName'] = i.data()['displayName'];
                //console.log("Get: " + i.data()['displayName']);
                getData['doctor'] = getResult;
                sendData.push(getData);
            }).catch(error => {
                res.status(401).json(response(401, error + ""));
            });
            console.log(sendData);
            //sendData.push(result.data());
        }
        res.status(200).send(sendData);
    }).catch((error) => {
        res.status(404).json(response(404, error + ""));
    });*/
};

let getDoctor = (hospitalName) => {

    //console.log(hospitalName);
    var getData = [];
    return new Promise(((resolve, reject) => {
        let ref = firestore.collection('users')
        ref.where('user_type', '==', 'doctor').where('hospitalName', '==', hospitalName).get().then(async (snapshot) => {
            let data = snapshot.docs;
            for (let i of data) {
                getData.push(i.data());
            }
            //console.log(getData);
            resolve(getData);
            return
        }).catch((error) => {
            reject(error);
            return
        });
    }));
};

module.exports.postCheckHistoryHandler = postCheckHistoryHandler;
module.exports.postBookAppoinmentHandler = postBookAppoinmentHandler;
module.exports.postShowAvailableDoctorHandler = postShowAvailableDoctorHandler;