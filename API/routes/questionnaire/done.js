/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๘/๐๑/๒๕๖๕>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import express from 'express';
import atob from 'atob';

import util from '../../util.js';

import questionnaireModel from '../../models/questionnaire.js';

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

export default router;