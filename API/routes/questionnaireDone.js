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

router.post('/Post', (req, res, next) => {
    questionnaireDone.doSet('POST', decodeURI(atob(req.body.jsonData)))
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

router.put('/Put', (req, res, next) => {
    questionnaireDone.doSet('PUT', decodeURI(atob(req.body.jsonData)))
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

module.exports = router;