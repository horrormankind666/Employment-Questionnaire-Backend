/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๘/๐๑/๒๕๖๕>
Modify date : <๒๘/๐๑/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const express = require('express');
const util = require('../util');
const model = require('../models/student');

const router = express.Router();

router.get('/Get', (req, res, next) => {
    let PPID = req.payload.ppid;

    model.doGet(PPID)
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

module.exports = router;