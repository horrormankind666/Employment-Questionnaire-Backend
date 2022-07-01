/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๒/๐๔/๒๕๖๕>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import express from 'express';
import request from 'request';
import atob from 'atob';

import util from '../util.js';

import msentModel from '../models/m-sent.js';

const router = express.Router();

router.get('/Get', (req, res, next) => {
    let route = ((req.query.route !== undefined && req.query.route.length > 0) ? req.query.route.toLowerCase() : '') ;
    let id = ((req.query.id !== undefined && req.query.id.length > 0) ? req.query.id : '');
    let userCode = ((req.query.userCode !== undefined && req.query.userCode.length > 0) ? req.query.userCode : '');
    let url = 'https://dcu-sitapi.mahidol.ac.th/service/api/v1/';
    /*
    let url = 'https://dcu-consent.mahidol.ac.th/service/api/v1/';
    */
    let query;
    
    switch (route) {
        case "version":
            query = ('?userCode=' + userCode);
            break;
        case "termsandconditions":
            query = ('?termsAndCondId=' + id + '&userCode=' + userCode);
            break;
        case "privacypolicy":
            query = ('?privacyPolicyId=' + id + '&userCode=' + userCode);
            break;
        case "consent":
            query = ('?consentId=' + id + '&userCode=' + userCode);
            break;
        default:
            query = '';
            break;
    }

    let options = {
        'url': (url + route + query),
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json',
            'language': req.headers['lang'],
			'api-client-id': req.headers['client-id'],
			'api-client-secret': req.headers['client-secret']
        }
    };

    request(options, function (error, result) {
        if (error)
            throw new Error(error);

        res.send(JSON.parse(result.body));
    });
});

router.post('/Post', (req, res, next) => {
    msentModel.doSet(decodeURI(atob(req.body.jsonData)))
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

export default router;