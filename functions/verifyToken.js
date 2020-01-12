const { firestore } = require('./dbconnection');
const { response } = require('./../response');

let verifyToken = (req, res, next) => {
    var token = req.get('token');
    if (token) {

        var ref = firestore.collection('users');
        ref.where('token', '==', token).get().then(snapshot => {
            if (snapshot.size > 1 || snapshot.empty) {
                res.status(401).json(response(401, "Token is invalid."));
            } else {
                next();
            }
        });
    } else {
        res.status(401).json(response(401, "Token not found."));
    }
};

module.exports.verifyToken = verifyToken;