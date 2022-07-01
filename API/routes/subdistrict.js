/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๒/๑๑/๒๕๖๔>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import express from 'express';

import util from '../util.js';

import subdistrictModel from '../models/subdistrict.js';

const router = express.Router();

router.get('/GetList', (req, res, next) => {
    subdistrictModel.doGetList()
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

export default router;