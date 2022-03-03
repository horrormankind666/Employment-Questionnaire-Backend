/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๒/๑๑/๒๕๖๔>
Modify date : <๐๓/๐๓/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const express = require('express');
const util = require('../util');
const subdistrictModel = require('../models/subdistrict')

const router = express.Router();

router.get('/GetList', (req, res, next) => {
    subdistrictModel.doGetList()
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

module.exports = router;