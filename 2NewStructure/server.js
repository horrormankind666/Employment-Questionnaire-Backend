/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๒/๐๓/๒๕๖๕>
Modify date : <๐๒/๐๓/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const dotenv = require("dotenv");
const express = require('express');
const utils = require('./util');

const app = express();
const router = express.Router();

dotenv.config();

app.get('/', (req, res) => {
    res.status(400).json('Bad Request');
});
app.get('/2NewStructure', (req, res) => {
    let util = new utils.Util();

    res.send(util.DB.doTest());
});

app.listen(process.env.PORT, () => {
    console.log('Server API is running at port %s', process.env.PORT);
});