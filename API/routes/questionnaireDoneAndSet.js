/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๓/๐๙/๒๕๖๔>
Modify date : <๑๐/๐๑/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const express = require('express');
const util = require('../util');
const model = require('../models/questionnaire');

const router = express.Router();
const questionnaireDoneAndSet = new model.QuestionnaireDoneAndSet();

router.get('/GetList', (request, response, next) => {
    let PPID = request.payload.ppid;

    questionnaireDoneAndSet.doGetList(PPID)
        .then((result) => {
            response.json(util.doGetAPIMessage(response.statusCode, result.dataset, result.message));
        });
});

router.get('/Get/(:CUID)', (request, response, next) => {
    let CUIDInfos = util.doParseCUID(request.params.CUID);
    let questionnaireDoneID = (CUIDInfos !== null ? (CUIDInfos[0].length > 0 ? CUIDInfos[0] : null) : null);
    let questionnaireSetID = (CUIDInfos !== null ? (CUIDInfos[1].length > 0 ? CUIDInfos[1] : null) : null);
    let PPID = request.payload.ppid;

    questionnaireDoneAndSet.doGet(questionnaireDoneID, questionnaireSetID, PPID)
        .then((result) => {
            response.json(util.doGetAPIMessage(response.statusCode, result.dataset, result.message));
        });
});

module.exports = router;