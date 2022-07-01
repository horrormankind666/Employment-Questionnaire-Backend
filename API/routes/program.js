/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๑/๐๒/๒๕๖๕>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import express from 'express';

import util from '../util.js';

import programModel from '../models/program.js';

const router = express.Router();

router.get('/GetList', (req, res, next) => {
    programModel.doGetList()
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

export default router;