/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๐/๐๙/๒๕๖๔>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import util from './util.js';

import studentModel from './models/student.js';

import tokenRoute from './routes/token.js';
import msentRoute from './routes/m-sent.js';
import studentRoute from './routes/student.js';
import careerRoute from './routes/career.js';
import programRoute from './routes/program.js';
import countryRoute from './routes/country.js';
import provinceRoute from './routes/province.js';
import districtRoute from './routes/district.js';
import subdistrictRoute from './routes/subdistrict.js';
import questionnaireDoneAndSetRoute from './routes/questionnaire/doneandset.js';
import questionnaireResultRoute from './routes/questionnaire/result.js';
import questionnaireDoneRoute from './routes/questionnaire/done.js';

const app = express();
const router = express.Router();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    let urls = (req.url.split('/'));
    let url = (urls.length > 2 ? urls[2] : '');

    if (['Token', 'M-Sent'].filter((route) => route === url).length > 0)
        next();
    else {
        let authen = util.authorization.ADFS.doGetInfo(req);
        
        if (authen.isAuthenticated) {
            studentModel.doGet(authen.payload.ppid)
                .then((result) => {
                    if (result.dataset.length > 0) {
                        if (url === 'Student') 
                            res.send(util.doGetAPIMessage(authen.statusCode, result.dataset, authen.message));
                        else {
                            req.payload = authen.payload;
                            
                            next();
                        }
                    }
                    else {
                        authen.statusCode = 404;
                        authen.isAuthenticated = false;
                        authen.message = 'User Not Found';

                        res.send(util.doGetAPIMessage(authen.statusCode, [], authen.message));
                    }
                });
        }
        else
            res.send(util.doGetAPIMessage(authen.statusCode, [], authen.message));
    }
});
app.use('/API', router);

app.get('/', (req, res) => {
    res.status(400).json(util.doGetAPIMessage(res.statusCode, [], 'Bad Request'));
});

app.post('/', (req, res) => {
    res.status(400).json(util.doGetAPIMessage(res.statusCode, [], 'Bad Request'));
});

router.use('/Token', tokenRoute);
router.use('/M-Sent', msentRoute);
router.use('/Student', studentRoute);
router.use('/Career', careerRoute);
router.use('/Program', programRoute);
router.use('/Country', countryRoute);
router.use('/Province', provinceRoute);
router.use('/District', districtRoute);
router.use('/Subdistrict', subdistrictRoute);
router.use('/Questionnaire/DoneAndSet', questionnaireDoneAndSetRoute);
router.use('/Questionnaire/Result', questionnaireResultRoute);
router.use('/Questionnaire/Done', questionnaireDoneRoute);

app.listen(process.env.PORT, () => {
    console.log('Server API is running at port %s', process.env.PORT);
});