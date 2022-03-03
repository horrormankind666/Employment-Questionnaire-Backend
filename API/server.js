/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๐/๐๙/๒๕๖๔>
Modify date : <๐๓/๐๓/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const util = require('./util');
const studentModel = require('./models/student');
const tokenRoute = require('./routes/token');
const studentRoute = require('./routes/student');
const careerRoute = require('./routes/career');
const programRoute = require('./routes/program');
const countryRoute = require('./routes/country');
const provinceRoute = require('./routes/province');
const districtRoute = require('./routes/district');
const subdistrictRoute = require('./routes/subdistrict');
const questionnaireDoneAndSetRoute = require('./routes/questionnaireDoneAndSet');
const questionnaireDoneRoute = require('./routes/questionnaireDone');

require("dotenv").config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    let urls = (req.url.split('/'));
    let url = (urls.length > 2 ? urls[2] : '');

    if (url === 'Token')
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
router.use('/Student', studentRoute);
router.use('/Career', careerRoute);
router.use('/Program', programRoute);
router.use('/Country', countryRoute);
router.use('/Province', provinceRoute);
router.use('/District', districtRoute);
router.use('/Subdistrict', subdistrictRoute);
router.use('/DoneAndSet', questionnaireDoneAndSetRoute);
router.use('/Done', questionnaireDoneRoute);

app.listen(process.env.PORT, () => {
    console.log('Server API is running at port %s', process.env.PORT);
});