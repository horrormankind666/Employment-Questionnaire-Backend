/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๒/๑๑/๒๕๖๔>
Modify date : <๒๑/๑๒/๒๕๖๔>
Description : <>
=============================================
*/

'use strict';

const express = require('express');
const util = require('../util');
const model = require('../models/country')

const router = express.Router();

router.get('/GetList', (request, response, next) => {
    model.doGetList()
        .then((result) => {
            response.json(util.doGetAPIMessage(response.statusCode, result.dataset, result.message));
        });
});

module.exports = router;