module.exports.sendResponse = function(res, statusCode, message, additionalData) {
    let response = {};

    if (statusCode >= 400) response.ok = false;
    else response.ok = true;

    if (message) response.message = message;

    if (additionalData) Object.assign(response, additionalData)

    res.status(statusCode);
    res.json(response);
}