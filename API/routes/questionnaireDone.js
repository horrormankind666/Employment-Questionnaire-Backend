/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๘/๐๑/๒๕๖๕>
Modify date : <๐๘/๐๑/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const express = require('express');
const atob = require('atob');
const util = require('../util');
const model = require('../models/questionnaire');

const router = express.Router();
const questionnaireDone = new model.QuestionnaireDone();

router.post('/Post', (request, response, next) => {
    questionnaireDone.doSet('POST', decodeURI(atob(request.body.jsonData)))
        .then((result) => {
            response.json(util.doGetAPIMessage(response.statusCode, result.dataset, result.message));
        });
});

router.put('/Put', (request, response, next) => {
    questionnaireDone.doSet('PUT', decodeURI(atob(request.body.jsonData)))
        .then((result) => {
            response.json(util.doGetAPIMessage(response.statusCode, result.dataset, result.message));
        });
});

module.exports = router;