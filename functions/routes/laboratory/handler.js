const { response } = require('./../../../response');
const { firestore, auth } = require('./../../dbconnection');

let postPendingReportsHandlers = (req, res, next) => {

    var email = req.body.email;
    var sendData = {};
    laboratory(email, "pending").then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });

};

let postDoneReportsHandlers = (req, res, next) => {

    var email = req.body.email;
    var sendData = {};
    laboratory(email, "done").then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });

};

let laboratory = (email, status) => {

    return new Promise(((resolve, reject) => {
        var reportsRecord = [];
        let reportsRef_1 = firestore.collection('reports');
        reportsRef_1.get().then(async snapshot => {
            let data = snapshot.docs;
            for (let i of data) {
                var patientId = i.data().patientId;
                let reportRef_2 = firestore.collection('reports').doc(patientId).collection('data');
                await reportRef_2.where('laboratoryEmail', '==', email).get().then(async querySnapshot => {
                    await reportRef_2.where('collectingStatus', '==', status).get().then(snapshot => {
                        for (let j of snapshot.docs) {
                            reportsRecord.push(j.data());
                        }
                    }).catch((error) => {
                        reject(error);
                        return
                    });
                }).catch((error) => {
                    reject(error);
                    return
                });
            }
            resolve(reportsRecord);
            return
        }).catch((error) => {
            reject(error);
            return
        });
    }));
};

let postAddReportHandlers = (req, res, next) => {

    var patientId = req.body.patientId;
    var reportId = req.body.reportId;
    var reportLink = req.body.reportLink;
    let reportRef = firestore.collection('reports');
    reportRef.where('uid', '==', patientId).get().then(querySnapshot => {
        let ref = firestore.collection('reports').doc(patientId).collection('data');
        ref.where('reportId', '==', reportId).get().then(snapshot => {
            ref.doc(reportId).set({ reportLink: reportLink }, { merge: true }).then((result) => {
                ref.doc(reportId).update('collectingStatus', 'done').then((result) => {
                    res.status(200).json(response(200, "Report added succesfully."));
                }).catch((error) => {
                    res.status(401).json(response(401, error + ""));
                });
            }).catch((error) => {
                res.status(401).json(response(401, error + ""));
            });
        }).catch((error) => {
            res.status(401).json(response(401, error + ""));
        });
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });
};

module.exports.postPendingReportsHandlers = postPendingReportsHandlers;
module.exports.postDoneReportsHandlers = postDoneReportsHandlers;
module.exports.postAddReportHandlers = postAddReportHandlers;