const { response } = require('./../../../response');
const { firestore } = require('./../../dbconnection');

let postCheckAppointmentStatusHandler = async (req, res, next) => {

    var hospitalId = req.params.hospitalId;
    var status = req.params.status;
    var ref_1 = firestore.collection('appointment');
    await ref_1.where('hospitalId', '==', hospitalId).get().then(async(hospitalSnapshot) => {
        let hId;
        let sendData = [];
        await hospitalSnapshot.forEach(result => {
            hId = result.data().hospitalId;
        });
        let ref_2 = firestore.collection('appointment').doc(hId).collection('data');
        await ref_2.where('status', '==', status).get().then(async(dataSnapshot) => {
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

module.exports.postCheckAppointmentStatusHandler = postCheckAppointmentStatusHandler;