/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๐/๐๙/๒๕๖๔>
Modify date : <๑๓/๐๙/๒๕๖๔>
Description : <>
=============================================
*/

const cors = require('cors');
const dotenv = require("dotenv");
const express = require('express');
const util = require('./util')
const questionnaireRoute = require('./routes/questionnaire')

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

router.use('/Questionnaire', questionnaireRoute);

app.listen(process.env.PORT, () => {
    console.log('Server API is running at port %s', process.env.PORT);
});