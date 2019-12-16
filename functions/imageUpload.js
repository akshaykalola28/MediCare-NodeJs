const { Storage } = require('@google-cloud/storage');

const imageUpload = (fileToStore, base64str) => {

    const storage = new Storage();
    const bucket = storage.bucket();
    const imageBuffer = Buffer.from(base64str, 'base64');
    const imageByteArray = new Uint8Array(imageBuffer);
    const file = bucket.file(fileToStore);

    return new Promise(((resolve, reject) => {
        file.save(imageByteArray, {
            public: true
        }, (error) => {
            if (error) {
                reject(error);
                return
            } else {
                imageURL = `https://storage.googleapis.com/medicare-888f7.appspot.com/${fileToStore}`;
                resolve(imageURL);
            }
        });
    }));
};

module.exports.imageUpload = imageUpload;
