/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๓/๐๙/๒๕๖๔>
Modify date : <๐๔/๐๕/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const sql = require('mssql');
const util = require('../util');
const schema = require('./schema');

class QuestionnaireDoneAndSet {
    async doGetList(
         perPersonID,
         studentCode) {
        let conn;
        let connRequest;

        try {
            conn = await util.db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
            connRequest = conn.request();
            connRequest.input('perPersonID', sql.VarChar, perPersonID);
            connRequest.input('studentCode', sql.VarChar, studentCode);
        }
        catch {
        }
        
        let data = await util.db.doExecuteStoredProcedure(connRequest, 'sp_empGetListQuestionnaireDoneAndSet');
        let ds = [];

        if (data.dataset.length > 0) {
            data.dataset[0].forEach(dr => {
                ds.push(new schema.QuestionnaireSet(
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
                    dr.showStatus,
                    dr.cancelStatus,
                    dr.empQuestionnaireDoneID,
                    dr.submitStatus,
                    dr.doneDate,
                    dr.actionDate
                ));
            });
        }

        data.dataset = ds;
        util.db.doConnClose(conn);

        return data;
    }

    async doGet(
        questionnaireDoneID,
        questionnaireSetID,
        perPersonID,
        studentCode
    ) {
        let conn;
        let connRequest;

        try {
            conn = await util.db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
            connRequest = conn.request();
            connRequest.input('empQuestionnaireDoneID', sql.VarChar, questionnaireDoneID);
            connRequest.input('empQuestionnaireSetID', sql.VarChar, questionnaireSetID);
            connRequest.input('perPersonID', sql.VarChar, perPersonID);
            connRequest.input('studentCode', sql.VarChar, studentCode);
        }
        catch {
        }

        let data = await util.db.doExecuteStoredProcedure(connRequest, 'sp_empGetQuestionnaireDoneAndSet');
        let ds = [];
        let qtndone = null;
        let qtnanswered = [];
        let qtnset = null;
        let qtnsections = [];
        let qtnquestions = [];
        let qtnanswersets = [];
        let qtnanswers = [];

        if (data.dataset.length > 0) {
            data.dataset[0].forEach(dr => {
                qtndone = new schema.QuestionnaireDone(
                    dr.ID,
                    dr.empQuestionnaireSetID,
                    {
                        PPID: dr.PPID,
                        perPersonID: dr.perPersonID,
                        studentCode: dr.studentCode,
                        IDCard: dr.IDCard,
                        titlePrefix: {
                            th: dr.titlePrefixTH,
                            en: dr.titlePrefixEN
                        },
                        firstName: {
                            th: dr.firstNameTH,
                            en: dr.firstNameEN
                        },
                        middleName: {
                            th: dr.middleNameTH,
                            en: dr.middleNameEN
                        },
                        lastName: {
                            th: dr.lastNameTH,
                            en: dr.lastNameEN
                        },
                        instituteName: {
                            th: dr.instituteNameTH,
                            en: dr.instituteNameEN
                        },
                        facultyID: dr.facultyID,
                        facultyCode: dr.facultyCode,
                        facultyName: {
                            th: dr.facultyNameTH,
                            en: dr.facultyNameEN
                        },
                        programID: dr.programID,
                        programCode: dr.programCode,
                        majorCode: dr.majorCode,
                        groupNum: dr.groupNum,
                        degreeLevelName: {
                            th: dr.degreeLevelNameTH,
                            en: dr.degreeLevelNameEN
                        },
                        programName: {
                            th: dr.programNameTH,
                            en: dr.programNameEN
                        },
                        degreeName: {
                            th: dr.degreeNameTH,
                            en: dr.degreeNameEN
                        },
                        branchID: dr.branchID,
                        branchName: {
                            th: dr.branchNameTH,
                            en: dr.branchNameEN
                        },
                        classYear: dr.class,
                        yearEntry: dr.yearEntry,
                        gender: dr.gender,
                        birthDate: dr.birthDate,
                        nationalityName: {
                            th: dr.nationalityNameTH,
                            en: dr.nationalityNameEN
                        },
                        nationality2Letter: dr.nationality2Letter,
                        nationality3Letter: dr.nationality3Letter,
                        raceName: {
                            th: dr.raceNameTH,
                            en: dr.raceNameEN
                        },
                        race2Letter: dr.race2Letter,
                        race3Letter: dr.race3Letter
                    },
                    dr.submitStatus,
                    dr.cancelStatus,
                    dr.actionDate,
                    dr.doneDate
                );
            });
            
            data.dataset[1].forEach(dr => {
                qtnanswered.push(new schema.QuestionnaireAnswered(
                    dr.ID,
                    dr.empQuestionnaireDoneID,
                    dr.empQuestionnaireQuestionID,
                    dr.errorStatus,
                    dr.empQuestionnaireAnswerSetID,
                    JSON.parse(dr.answer),
                    dr.actionDate
                ));
            });

            data.dataset[2].forEach(dr => {
                qtnset = new schema.QuestionnaireSet(
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
                    dr.showStatus,
                    dr.cancelStatus,
                    null,
                    null,
                    null,
                    dr.actionDate
                );
            });

            data.dataset[3].forEach(dr => {
                qtnsections.push(new schema.QuestionnaireSection(
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
                    dr.disableStatus,
                    dr.actionDate
                ));
            });

            data.dataset[4].forEach(dr => {
                qtnquestions.push(new schema.QuestionnaireQuestion(
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

            data.dataset[5].forEach(dr => {
                qtnanswersets.push(new schema.QuestionnaireAnswerSet(
                    dr.ID,
                    dr.empQuestionnaireQuestionID,
                    dr.no,
                    {
                        th: dr.titleNameTH,
                        en: dr.titleNameEN
                    },
                    JSON.parse(dr.inputType),
                    dr.actionDate
                ));
            });

            data.dataset[6].forEach(dr => {
                qtnanswers.push(new schema.QuestionnaireAnswer(
                    dr.ID,
                    dr.empQuestionnaireAnswerSetID,
                    dr.no,
                    dr.choiceOrder,
                    {
                        th: dr.nameTH,
                        en: dr.nameEN
                    },
                    {
                        th: dr.descriptionTH,
                        en: dr.descriptionEN
                    },
                    JSON.parse(dr.inputType),
                    JSON.parse(dr.specify),
                    JSON.parse(dr.eventAction),
                    dr.actionDate
                ));
            });
        }

        ds.push(new schema.QuestionnaireDoneAndSet(
            qtndone,
            qtnanswered,
            qtnset,
            qtnsections,
            qtnquestions,
            qtnanswersets,
            qtnanswers
        ));

        data.dataset = ds;
        util.db.doConnClose(conn);

        return data;
    }
}

class QuestionnaireDone {
    async doSet(
        method,
        jsonData
    ) {
        let conn;
        let connRequest;
        
        try {
            conn = await util.db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
            connRequest = conn.request();
            connRequest.input('method', sql.VarChar, method);
            connRequest.input('jsonData', sql.NVarChar, jsonData);
        }
        catch {
        }

        let data = await util.db.doExecuteStoredProcedure(connRequest, 'sp_empSetQuestionnaireDone');
        let ds = [];
        
        if (data.dataset.length > 0)
            ds = data.dataset;

        data.dataset = ds;
        util.db.doConnClose(conn);

        return data;
    }
}

class Questionnaire {
    constructor() {
        this.doneandset = new QuestionnaireDoneAndSet(),
        this.done = new QuestionnaireDone()
    }
}

module.exports = new Questionnaire();