/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๗/๑๐/๒๕๖๔>
Modify date : <๒๗/๑๐/๒๕๖๔>
Description : <>
=============================================
*/

'use strict';

const express = require('express');
const util = require('../util');
const model = require('../models/province')

const router = express.Router();

router.get('/GetList', (req, res, next) => {
    model.doGetList()
        .then((result) => {
            res.json(util.doGetAPIMessage(res.statusCode, result.dataset, result.message));
        });
});

module.exports = router;