let response = (auth, responseSuccess, data) => {
    return {
        auth: auth,
        responseSuccess: responseSuccess,
        data: data
    }
};

module.exports.response = response;