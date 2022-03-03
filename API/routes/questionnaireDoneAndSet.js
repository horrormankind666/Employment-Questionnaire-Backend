/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๓/๐๙/๒๕๖๔>
Modify date : <๐๓/๐๓/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const express = require('express');
const util = require('../util');
const questionnaireModel = require('../models/questionnaire');

const router = express.Router();

router.get('/GetList', (req, res, next) => {
    let PPID = req.payload.ppid;

    questionnaireModel.doneandset.doGetList(PPID)
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

router.get('/Get/(:CUID)?', (req, res, next) => {
    let CUIDInfos = util.doParseCUID(req.params.CUID);
    let questionnaireDoneID = (CUIDInfos !== null ? (CUIDInfos[0].length > 0 ? CUIDInfos[0] : null) : null);
    let questionnaireSetID = (CUIDInfos !== null ? (CUIDInfos[1].length > 0 ? CUIDInfos[1] : null) : null);
    let PPID = req.payload.ppid;

    questionnaireModel.doneandset.doGet(questionnaireDoneID, questionnaireSetID, PPID)
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

module.exports = router;