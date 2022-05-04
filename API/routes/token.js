/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๗/๐๑/๒๕๖๕>
Modify date : <๐๒/๐๕/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const atob = require('atob');
const express = require('express');
const http = require('http');
const request = require('request');
const util = require('../util');

const router = express.Router();

router.post('/Get', (req, res, next) => {
    let CUIDInfos = util.doParseCUID(req.body.CUID);
    let redirectURL = null;
    let code = null;

    if (CUIDInfos !== null) {
        redirectURL = (CUIDInfos[0].length > 0 ? CUIDInfos[0] : null);
        code = (CUIDInfos[1].length > 0 ? CUIDInfos[1] : null);
    }

    let options = {
        'url': 'https://idp.mahidol.ac.th/adfs/oauth2/token',
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'client_id': '1e885f66-7503-4a27-b2fc-b553f7c7b739',
            'client_secret': 'ZSgPnakihgnv5IsRYEf2ERiA4w8XdzCcvq_xYmhN',
            'resource': '48af9268-6e52-4aaa-b9d3-140f434f7a58',
            'grant_type': 'authorization_code',
            'redirect_uri': atob(redirectURL),
            'code': atob(code)
        }
    };

    request(options, function (error, result) {
        if (error)
            throw new Error(error);

        res.send(JSON.stringify(result.body, replacer));
    });
});

function replacer(key, value) {
    if (typeof value === 'string') {
        return (value.split('').reverse().join(''));
    }
    
    return value
}

module.exports = router;