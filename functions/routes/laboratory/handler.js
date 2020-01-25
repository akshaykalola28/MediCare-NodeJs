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
        res.status(200).sebd(data);
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });

};

let laboratory = (email, status) => {

    return new Promise(((resolve, reject) => {
        var reportsRecord = [];
        auth.getUserByEmail(email).then((userRecord) => {
            let uid = userRecord.uid;
            let reportsRef = firestore.collection('reports').doc(uid).collection('data');
            reportsRef.where('collectingStatus', '==', status).get().then(snapshot => {
                let data = snapshot.docs;
                for (let i of data) {
                    reportsRecord.push(i.data());
                }
                resolve(reportsRecord);
                return
            });
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
            ref.doc(reportId).set({reportLink: reportLink}, {merge: true}).then((result) => {
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