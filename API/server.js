/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๐/๐๙/๒๕๖๔>
Modify date : <๐๒/๑๑/๒๕๖๔>
Description : <>
=============================================
*/

'use strict';

const cors = require('cors');
const dotenv = require("dotenv");
const express = require('express');
const util = require('./util');
const countryRoute = require('./routes/country');
const provinceRoute = require('./routes/province');
const districtRoute = require('./routes/district');
const subdistrictRoute = require('./routes/subdistrict');
const questionnaireRoute = require('./routes/questionnaire');

const app = express();
const router = express.Router();

dotenv.config();

app.use(cors());

app.use((request, response, next) => {
    let authorization = new util.Authorization();
    let authen = authorization.ADFS.getInfo(request);

    if (authen.isAuthenticated) {
        request.payload = authen.payload;
        next();
    }
    else
        response.send(util.getAPIMessage(authen.statusCode, [], authen.message));
});
app.use('/API', router);

app.get('/', (request, response) => {
    response.status(400).json(util.getAPIMessage(response.statusCode, [], 'Bad Request'));
});

router.use('/Country', countryRoute);
router.use('/Province', provinceRoute);
router.use('/District', districtRoute);
router.use('/Subdistrict', subdistrictRoute);
router.use('/Questionnaire', questionnaireRoute);

app.listen(process.env.PORT, () => {
    console.log('Server API is running at port %s', process.env.PORT);
});