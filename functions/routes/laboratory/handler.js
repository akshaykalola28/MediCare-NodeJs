const { response } = require('./../../../response');
const { firestore, auth } = require('./../../dbconnection');

let postPendingReportsHandlers = (req, res, next) => {

    var email = req.body.email;
    var sendData = {};
    laboratory(email, "pending").then((data) => {
        res.status(200).json(response(200, data));
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });

};

let postDoneReportsHandlers = (req, res, next) => {

    var email = req.body.email;
    var sendData = {};
    laboratory(email, "done").then((data) => {
        res.status(200).json(response(200, data));
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

module.exports.postPendingReportsHandlers = postPendingReportsHandlers;
module.exports.postDoneReportsHandlers = postDoneReportsHandlers;