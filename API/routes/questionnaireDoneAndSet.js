/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๓/๐๙/๒๕๖๔>
Modify date : <๐๒/๐๕/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const express = require('express');
const util = require('../util');
const questionnaireModel = require('../models/questionnaire');

const router = express.Router();

router.get('/GetList/(:CUID)', (req, res, next) => {
    let CUIDInfos = util.doParseCUID(req.params.CUID);
    let perPersonID = null;
    let studentCode = null;

    if (CUIDInfos !== null) {
        perPersonID = (CUIDInfos[0].length > 0 ? CUIDInfos[0] : null);
        studentCode = (CUIDInfos[1].length > 0 ? CUIDInfos[1] : null);
    }

    questionnaireModel.doneandset.doGetList(perPersonID, studentCode)
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

router.get('/Get/(:CUID)?', (req, res, next) => {
    let CUIDInfos = util.doParseCUID(req.params.CUID);
    let questionnaireDoneID = null;
    let questionnaireSetID = null;
    let perPersonID = null;
    let studentCode = null;
    
    if (CUIDInfos !== null) {
        questionnaireDoneID = (CUIDInfos[0].length > 0 ? CUIDInfos[0] : null);
        questionnaireSetID = (CUIDInfos[1].length > 0 ? CUIDInfos[1] : null);
        perPersonID = (CUIDInfos[2].length > 0 ? CUIDInfos[2] : null);
        studentCode = (CUIDInfos[3].length > 0 ? CUIDInfos[3] : null);
    }

    questionnaireModel.doneandset.doGet(questionnaireDoneID, questionnaireSetID, perPersonID, studentCode)
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

module.exports = router;