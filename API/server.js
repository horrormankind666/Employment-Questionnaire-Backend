/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๐/๐๙/๒๕๖๔>
Modify date : <๐๘/๐๑/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const cors = require('cors');
const dotenv = require("dotenv");
const express = require('express');
const bodyParser = require('body-parser');
const util = require('./util');
const countryRoute = require('./routes/country');
const provinceRoute = require('./routes/province');
const districtRoute = require('./routes/district');
const subdistrictRoute = require('./routes/subdistrict');
const questionnaireDoneAndSetRoute = require('./routes/questionnaireDoneAndSet');
const questionnaireDoneRoute = require('./routes/questionnaireDone');

const app = express();
const router = express.Router();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((request, response, next) => {
    let authorization = new util.Authorization();
    let authen = authorization.ADFS.doGetInfo(request);

    if (authen.isAuthenticated) {
        request.payload = authen.payload;
        next();
    }
    else
        response.send(util.doGetAPIMessage(authen.statusCode, [], authen.message));
});
app.use('/API', router);

app.get('/', (request, response) => {
    response.status(400).json(util.doGetAPIMessage(response.statusCode, [], 'Bad Request'));
});

app.post('/', (request, response) => {
    response.status(400).json(util.doGetAPIMessage(response.statusCode, [], 'Bad Request'));
});

router.use('/Country', countryRoute);
router.use('/Province', provinceRoute);
router.use('/District', districtRoute);
router.use('/Subdistrict', subdistrictRoute);
router.use('/DoneAndSet', questionnaireDoneAndSetRoute);
router.use('/Done', questionnaireDoneRoute);

app.listen(process.env.PORT, () => {
    console.log('Server API is running at port %s', process.env.PORT);
});