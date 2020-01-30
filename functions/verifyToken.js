const { firestore } = require('./dbconnection');
const { response } = require('./../response');

let verifyToken = (req, res, next) => {
    var token = req.get('token');
    var user_type = req.baseUrl;
    user_type = user_type.replace('/', '');
    if (token) {
        var ref = firestore.collection('users');
        ref.where('token', '==', token).get().then(async snapshot => {
            if (snapshot.size > 1 || snapshot.empty) {
                res.status(401).json(response(401, "Token is invalid."));
            } else {
                let user;
                await snapshot.forEach(doc => {
                    user = doc.data().user_type;
                    console.log(user);
                });
                if (user_type != "user") {
                    if (user != user_type) {
                        res.status(401).json(response(401, "Token does not match with user_type."));
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            }
        });
    } else {
        res.status(401).json(response(401, "Token not found."));
    }
};

module.exports.verifyToken = verifyToken;