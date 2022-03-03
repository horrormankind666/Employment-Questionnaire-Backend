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
const countryModel = require('../models/country')

const router = express.Router();

router.get('/GetList', (req, res, next) => {
    countryModel.doGetList()
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

module.exports = router;