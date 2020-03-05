const { response } = require('./../../../response');
const { auth, firestore } = require('./../../dbconnection');

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

module.exports.postCheckHistoryHandler = postCheckHistoryHandler;