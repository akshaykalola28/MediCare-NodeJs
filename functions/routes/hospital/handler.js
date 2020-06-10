const { response } = require('./../../../response');
const { firestore } = require('./../../dbconnection');
const { getNotificationToken } = require('./../../getNotificationToken');

let postCheckAppointmentStatusHandler = async (req, res, next) => {

    var hospitalId = req.params.hospitalId;
    var status = req.params.status;
    var ref_1 = firestore.collection('appointment');
    await ref_1.where('hospitalId', '==', hospitalId).get().then(async (hospitalSnapshot) => {
        let hId;
        let sendData = [];
        await hospitalSnapshot.forEach(result => {
            hId = result.data().hospitalId;
        });
        let ref_2 = firestore.collection('appointment').doc(hId).collection('data');
        await ref_2.where('status', '==', status).get().then(async (dataSnapshot) => {
            let data = dataSnapshot.docs;
            for (let i of data) {
                sendData.push(i.data());
            }
            res.status(200).send(sendData);
        }).catch((error) => {
            res.status(409).json(response(409, error + ""));
        });
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });
};

let postIsAppointmentApprovedHandler = async (req, res, next) => {

    var status = req.body.status;
    var patientId = req.body.patientId;
    var hospitalId = req.body.hospitalId;
    var date = req.body.date;
    var message = req.body.message; //If appointment rejected then why rejected Or if approved then what is timing to meeting
    let ref_1 = firestore.collection('appointment');
    await ref_1.where('hospitalId', '==', hospitalId).get().then(async(querySnapshot) => {
        let hId;
        await querySnapshot.forEach(result => {
            hId = result.data().hospitalId;
        });
        let ref_2 = firestore.collection('appointment').doc(hId).collection('data');
        await ref_2.where('date', '==', date).where('patientId', '==', patientId).get().then(async(updateSnapshot) => {
            let dataDocId;
            await updateSnapshot.forEach(result => {
                dataDocId = result.id;
            });
            let ref_3 = firestore.collection('appointment').doc(hId).collection('data').doc(dataDocId);
            await ref_3.update('status', status).then((value) => {
                res.status(200).send("Updated Succesfully");
                getNotificationToken(patientId, 'patient', "Appointment " + status, message).catch((error) => {
                    res.status(401).json(response(401, error + ""));
                });
            }).catch((error) => {
                res.status(409).json(response(409, error + ""));
            });
            console.log(dataDocId);
        }).catch((error) => {
            res.status(409).json(response(409, error + ""));
        });
    }).catch((error) => {
        res.status(401).json(response(401, error + ""));
    });
};

module.exports.postCheckAppointmentStatusHandler = postCheckAppointmentStatusHandler;
module.exports.postIsAppointmentApprovedHandler = postIsAppointmentApprovedHandler;