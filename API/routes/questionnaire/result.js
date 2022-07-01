/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๓๐/๐๖/๒๕๖๕>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import express from 'express';

import util from '../../util.js';

import questionnaireModel from '../../models/questionnaire.js';

const router = express.Router();

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

    questionnaireModel.result.doGet(questionnaireDoneID, questionnaireSetID, perPersonID, studentCode)
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

export default router;