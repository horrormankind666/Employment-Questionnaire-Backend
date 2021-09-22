/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๓/๐๙/๒๕๖๔>
Modify date : <๑๕/๐๙/๒๕๖๔>
Description : <>
=============================================
*/

const express = require('express');
const sql = require('mssql');
const util = require('../util');

const router = express.Router();

class QuestionnaireDoneSchema {
    constructor(
        ID,
        empQuestionnaireSetID,
        PPID,
        perPersonID,
        studentCode,
        fullName,
        instituteName,
        facultyID,
        facultyCode,
        facultyName,
        programID,
        programCode,
        majorCode,
        groupNum,
        dLevel,
        programName,
        address,
        empQuestionnaireAnswer,
        cancelStatus,
        actionDate
    ) {
        this.ID = ID,
        this.empQuestionnaireSetID = empQuestionnaireSetID,
        this.PPID = PPID,
        this.perPersonID = perPersonID,
        this.studentCode = studentCode,
        this.fullName = fullName,
        this.instituteName = instituteName,
        this.facultyID = facultyID,
        this.facultyCode = facultyCode,
        this.facultyName = facultyName,
        this.programID = programID,
        this.programCode = programCode,
        this.majorCode = majorCode,
        this.groupNum = groupNum,
        this.dLevel = dLevel,
        this.programName = programName,
        this.address = address,
        this.empQuestionnaireAnswer = empQuestionnaireAnswer,
        this.cancelStatus = cancelStatus,
        this.actionDate = actionDate
    }
}

class QuestionnaireSetSchema {
    constructor(
        ID,
        year,
        name,
        description,
        notice,
        doneStatus,
        cancelStatus,
        actionDate
    ) {
        this.ID = ID,
        this.year = year,
        this.name = name,
        this.description = description,
        this.notice = notice,
        this.doneStatus = doneStatus,
        this.cancelStatus = cancelStatus,
        this.actionDate = actionDate
    }
}

class QuestionnaireSectionSchema {
    constructor(
        ID,
        empQuestionnaireSetID,
        no,
        titleName,
        name,
        actionDate
    ) {
        this.ID = ID,
        this.empQuestionnaireSetID = empQuestionnaireSetID,
        this.no = no,
        this.titleName = titleName,
        this.name = name,
        this.actionDate = actionDate
    }
}

class QuestionnaireQuestionSchema {
    constructor(
        ID,
        empQuestionnaireSectionID,
        no,
        name,
        description,
        condition,
        actionDate
    ) {
        this.ID = ID,
        this.empQuestionnaireSectionID = empQuestionnaireSectionID,
        this.no = no,
        this.name = name,
        this.description = description,
        this.condition = condition,
        this.actionDate = actionDate
    }
}

class QuestionnaireAnswerSetSchema {
    constructor(
        ID,
        empQuestionnaireQuestionID,
        no,
        titleName,
        actionDate
    ) {
        this.ID = ID,
        this.empQuestionnaireQuestionID = empQuestionnaireQuestionID,
        this.no = no,
        this.titleName = titleName,
        this.actionDate = actionDate
    }
}

class QuestionnaireAnswerSchema {
    constructor(
        ID,
        empQuestionnaireAnswerSetID,
        defaultAnswerSet,
        no,
        name,
        description,
        inputType,
        value,
        specify,
        gotoSection,
        actionDate
    ) {
        this.ID = ID,
        this.empQuestionnaireAnswerSetID = empQuestionnaireAnswerSetID,
        this.defaultAnswerSet = defaultAnswerSet,
        this.no = no,
        this.name = name,
        this.description = description,
        this.inputType = inputType,
        this.value = value,
        this.specify = specify,
        this.gotoSection = gotoSection,
        this.actionDate = actionDate
    }
}

async function getList(PPID, perPersonID, studentCode) {
    let db = new util.DB(); 
    let connRequest;
    
    try {
        connRequest = await db.getConnectRequest();
        connRequest.input('PPID', sql.VarChar, PPID);
        connRequest.input('perPersonID', sql.VarChar, perPersonID);
        connRequest.input('studentCode', sql.VarChar, studentCode);
    }
    catch { }

    return db.executeStoredProcedure('sp_empGetListQuestionnaireDoneAndSet', connRequest);
}

async function get(PPID, perPersonID, studentCode, questionnaireSetID) {
    let db = new util.DB(); 
    let connRequest;

    try {
        connRequest = await db.getConnectRequest();
        connRequest.input('PPID', sql.VarChar, PPID);
        connRequest.input('perPersonID', sql.VarChar, perPersonID);
        connRequest.input('studentCode', sql.VarChar, studentCode);
        connRequest.input('empQuestionnaireSetID', sql.VarChar, questionnaireSetID);
    }
    catch { }

    return db.executeStoredProcedure('sp_empGetQuestionnaireDoneAndSet', connRequest);
}

router.get('/TakeAndSet/GetList', (request, response, next) => {
    let PPID = request.payload.ppid;
    let perPersonID = request.payload.perPersonID;
    let studentCode = request.payload.studentCode;

    getList(PPID, perPersonID, studentCode).then((result) => {
        let ds = [];

        if (result.data.length > 0) {
            result.data[0].forEach(dr => {
                ds.push(new QuestionnaireSetSchema(
                    dr.ID,
                    dr.year,
                    {
                        th: dr.nameTH,
                        en: dr.nameEN
                    },
                    {
                        th: dr.descriptionTH,
                        en: dr.descriptionEN
                    },
                    {
                        th: dr.noticeTH,
                        en: dr.noticeEN

                    },
                    dr.doneStatus,
                    dr.cancelStatus,
                    dr.actionDate
                ));
            });
        }

        response.json(util.getAPIMessage(response.statusCode, ds, result.message));
    });
});

router.get('/TakeAndSet/Get/(:questionnaireSetID)', (request, response, next) => {
    let PPID = request.payload.ppid;
    let perPersonID = request.payload.perPersonID;
    let studentCode = request.payload.studentCode;
    let questionnaireSetID = request.params.questionnaireSetID;

    get(PPID, perPersonID, studentCode, questionnaireSetID).then((result) => {
        let ds = [];
        let dsQuestionnaireDone = [];
        let dsQuestionnaireSet = [];
        let dsQuestionnaireSection = [];
        let dsQuestionnaireQuestion = [];
        let dsQuestionnaireAnswerSet = [];
        let dsQuestionnaireAnswer = [];

        if (result.data.length > 0) {
            result.data[0].forEach(dr => {
                dsQuestionnaireDone.push(new QuestionnaireDoneSchema(
                    dr.ID,
                    dr.empQuestionnaireSetID,
                    dr.PPID,
                    dr.perPersonID,
                    dr.studentCode,
                    {
                        th: dr.fullNameTH,
                        en: dr.fullNameEN
                    },
                    {
                        th: dr.instituteNameTH,
                        en: dr.instituteNameEN
                    },
                    dr.facultyID,
                    dr.facultyCode,
                    {
                        th: dr.facultyNameTH,
                        en: dr.facultyNameEN
                    },
                    dr.programID,
                    dr.programCode,
                    dr.majorCode,
                    dr.groupNum,
                    dr.dLevel,
                    {
                        th: dr.programNameTH,
                        en: dr.programNameEN
                    },
                    dr.address,
                    dr.empQuestionnaireAnswer,
                    dr.cancelStatus,
                    dr.actionDate
                ));
            });

            result.data[1].forEach(dr => {
                dsQuestionnaireSet.push(new QuestionnaireSetSchema(
                    dr.ID,
                    dr.year,
                    {
                        th: dr.nameTH,
                        en: dr.nameEN
                    },
                    {
                        th: dr.descriptionTH,
                        en: dr.descriptionEN
                    },
                    {
                        th: dr.noticeTH,
                        en: dr.noticeEN

                    },
                    dr.doneStatus,
                    dr.cancelStatus,
                    dr.actionDate
                ));
            });

            result.data[2].forEach(dr => {
                dsQuestionnaireSection.push(new QuestionnaireSectionSchema(
                    dr.ID,
                    dr.empQuestionnaireSetID,
                    dr.no,
                    {
                        th: dr.titleNameTH,
                        en: dr.titleNameEN
                    },
                    {
                        th: dr.nameTH,
                        en: dr.nameEN
                    },
                    dr.actionDate
                ));
            });

            result.data[3].forEach(dr => {
                dsQuestionnaireQuestion.push(new QuestionnaireQuestionSchema(
                    dr.ID,
                    dr.empQuestionnaireSectionID,
                    dr.no,
                    {
                        th: dr.nameTH,
                        en: dr.nameEN
                    },
                    {
                        th: dr.descriptionTH,
                        en: dr.descriptionEN
                    },
                    JSON.parse(dr.condition),
                    dr.actionDate
                ));
            });

            result.data[4].forEach(dr => {
                dsQuestionnaireAnswerSet.push(new QuestionnaireAnswerSetSchema(
                    dr.ID,
                    dr.empQuestionnaireQuestionID,
                    dr.no,
                    {
                        th: dr.titleNameTH,
                        en: dr.titleNameEN
                    },
                    dr.actionDate
                ));
            });

            result.data[5].forEach(dr => {
                dsQuestionnaireAnswer.push(new QuestionnaireAnswerSchema(
                    dr.ID,
                    dr.empQuestionnaireAnswerSetID,
                    dr.defaultAnswerSet,
                    dr.no,
                    {
                        th: dr.nameTH,
                        en: dr.nameEN
                    },
                    {
                        th: dr.descriptionTH,
                        en: dr.descriptionEN
                    },
                    dr.inputType,
                    dr.value,
                    JSON.parse(dr.specify),
                    dr.gotoSection,
                    dr.actionDate
                ));
            });
        }

        ds.push(
            dsQuestionnaireDone,
            dsQuestionnaireSet,
            dsQuestionnaireSection,
            dsQuestionnaireQuestion,
            dsQuestionnaireAnswerSet,
            dsQuestionnaireAnswer
        );

        response.json(util.getAPIMessage(response.statusCode, ds, result.message));
    });
});

module.exports = router;