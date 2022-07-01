/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๘/๐๑/๒๕๖๕>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import express from 'express';

import util from '../util.js';

import studentModel from '../models/student.js';

const router = express.Router();

router.get('/Get', (req, res, next) => {
    let PPID = req.payload.ppid;
    
    studentModel.doGet(PPID)
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

export default router;