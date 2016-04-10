const request = require('request');
const crypto = require('crypto');

const appkey = '2919e9e5972b07d73c20880c17a09161';
const appsecret = '476b28702d3b';

function checksum(appsecret, nonce, curtime) {
    var hmac = crypto.createHash('sha1').update(appsecret + nonce + curtime);
    return hmac.digest('hex');
}

function randomString() {
    return crypto.randomBytes(6).toString('hex');
}

function generateHeaders(appsecret) {
    var curtime = new Date().getTime();
    var nonce = randomString();
    return {
        AppKey: appkey,
        CurTime: curtime,
        Nonce: nonce,
        CheckSum: checksum(appsecret, nonce, curtime),
        "Content-Type": "application/x-www-form-urlencoded"
    }
}

function SMSRequest(path, data, callback) {
    var options = {
        url: 'https://api.netease.im/sms' + path,
        headers: generateHeaders(appsecret),
        form: data
    }

    request.post(options, function(error, response, body) {
        if (error || response.statusCode != 200) {
            callback({
                success: false,
                data: {
                    error: error,
                    response: response,
                    body: body
                }
            })
        } else {
            var data = JSON.parse(body);
            callback({
                success: data.code == 200,
                data: data
            })
        }
    })
}

function sendSMSTemplate(phone, id, callback) {
    SMSRequest('/sendtemplate.action', {
        mobiles: JSON.stringify([phone]),
        templateid: id,
    }, function(data) {
        callback(data);
    });
}

function getSMSStatus(id, callback) {
    SMSRequest('/querystatus.action', {
        sendid: id,
    }, function(data) {
        callback(data);
    });
}

module.exports = {
	sendSMSTemplate: sendSMSTemplate,
	getSMSStatus: getSMSStatus
}

