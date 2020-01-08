const { firestore, messaging } = require('./dbconnection');

let getNotificationToken = (email, user_type, title, body) => {

    var ref = firestore.collection('users');

    return new Promise(((resolve, reject) => {
        var notificationToken;
        ref.where('email', '==', email).where('user_type', '==', user_type).get().then(snapshot => {
            if (snapshot.size != 1) {
                reject(user_type + " does not exists with this " + email + " address.");
                return
            } else {
                snapshot.forEach(doc => {
                    notificationToken = doc.data().notificationToken;
                    if (title != null && body != null) {
                        var message = {
                            token: notificationToken,
                            notification: {
                                title: title,
                                body: body
                            }
                        };
                        messaging.send(message).then((response) => {
                            resolve(response);
                            return
                        }).catch((error) => {
                            reject(error);
                            return
                        });
                    } else {
                        resolve(notificationToken);
                        return
                    }
                });
            }
        }).catch((error) => {
            reject(error);
            return
        });
    }));
};

module.exports.getNotificationToken = getNotificationToken;