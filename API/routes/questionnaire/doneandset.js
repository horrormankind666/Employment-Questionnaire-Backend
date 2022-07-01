/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๓/๐๙/๒๕๖๔>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import express from 'express';

import util from '../../util.js';

import questionnaireModel from '../../models/questionnaire.js';

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

export default router;