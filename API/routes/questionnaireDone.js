/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๘/๐๑/๒๕๖๕>
Modify date : <๐๓/๐๓/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const express = require('express');
const atob = require('atob');
const util = require('../util');
const questionnaireModel = require('../models/questionnaire');

const router = express.Router();

router.post('/Post', (req, res, next) => {
    questionnaireModel.done.doSet('POST', decodeURI(atob(req.body.jsonData)))
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

router.put('/Put', (req, res, next) => {
    questionnaireModel.done.doSet('PUT', decodeURI(atob(req.body.jsonData)))
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

module.exports = router;