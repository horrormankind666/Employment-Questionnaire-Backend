/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๓/๐๙/๒๕๖๔>
Modify date : <๒๙/๐๙/๒๕๖๔>
Description : <>
=============================================
*/

'use strict';

const express = require('express');
const util = require('../util');
const model = require('../models/questionnaire')

const router = express.Router();

router.get('/DoneAndSet/GetList', (request, response, next) => {
    let PPID = request.payload.ppid;
    let perPersonID = request.payload.perPersonID;
    let studentCode = request.payload.studentCode;

    model.getList(PPID, perPersonID, studentCode).then((result) => {
        response.json(util.getAPIMessage(response.statusCode, result.dataset, result.message));
    });
});

router.get('/DoneAndSet/Get/(:questionnaireSetID)', (request, response, next) => {
    let PPID = request.payload.ppid;
    let perPersonID = request.payload.perPersonID;
    let studentCode = request.payload.studentCode;
    let questionnaireSetID = request.params.questionnaireSetID;

    model.get(PPID, perPersonID, studentCode, questionnaireSetID).then((result) => {
        response.json(util.getAPIMessage(response.statusCode, result.dataset, result.message));
    });
});

module.exports = router;