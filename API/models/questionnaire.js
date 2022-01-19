/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๓/๐๙/๒๕๖๔>
Modify date : <๑๒/๐๑/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const sql = require('mssql');
const util = require('../util');

class Schema {
    QuestionnaireDone = class {
        constructor(
            ID,
            empQuestionnaireSetID,
            userInfo = {
                PPID,
                perPersonID,
                studentCode,
                IDCard,
                titlePrefix,
                firstName,
                middleName,
                lastName,
                instituteName,
                facultyID,
                facultyCode,
                facultyName,
                programID,
                programCode,
                majorCode,
                groupNum,
                degreeLevelName,
                programName,
                degreeName,
                branchID,
                branchName,
                classYear,
                yearEntry,
                gender,
                birthDate,
                nationalityName,
                nationality2Letter,
                nationality3Letter,
                raceName,
                race2Letter,
                race3Letter
            },
            empQuestionnaireAnswer,
            submitStatus,
            cancelStatus,
            actionDate,
            doneDate
        ) {
            this.ID = ID,
            this.empQuestionnaireSetID = empQuestionnaireSetID,
            this.userInfo = userInfo,            
            this.empQuestionnaireAnswer = empQuestionnaireAnswer,
            this.submitStatus = submitStatus,
            this.cancelStatus = cancelStatus,
            this.actionDate = actionDate,
            this.doneDate = doneDate
        }
    }

    QuestionnaireSet = class { 
        constructor(
            ID,
            year,
            name,
            description,
            notice,
            showStatus,
            cancelStatus,
            empQuestionnaireDoneID,
            submitStatus,
            doneDate,
            actionDate
        ) {
            this.ID = ID,
            this.year = year,
            this.name = name,
            this.description = description,
            this.notice = notice,
            this.showStatus = showStatus,
            this.cancelStatus = cancelStatus,
            this.empQuestionnaireDoneID = empQuestionnaireDoneID,
            this.submitStatus = submitStatus,
            this.doneDate= doneDate,
            this.actionDate = actionDate
        }
    }

    QuestionnaireSection = class {
        constructor(
            ID,
            empQuestionnaireSetID,
            no,
            titleName,
            name,
            disableStatus,
            actionDate
        ) {
            this.ID = ID,
            this.empQuestionnaireSetID = empQuestionnaireSetID,
            this.no = no,
            this.titleName = titleName,
            this.name = name,
            this.disableStatus = disableStatus,
            this.actionDate = actionDate
        }
    }

    QuestionnaireQuestion = class {
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

    QuestionnaireAnswerSet = class {
        constructor(
            ID,
            empQuestionnaireQuestionID,
            no,
            titleName,
            inputType,
            actionDate
        ) {
            this.ID = ID,
            this.empQuestionnaireQuestionID = empQuestionnaireQuestionID,
            this.no = no,
            this.titleName = titleName,
            this.inputType = inputType,
            this.actionDate = actionDate
        }
    }

    QuestionnaireAnswer = class {
        constructor(
            ID,
            empQuestionnaireAnswerSetID,
            no,
            choiceOrder,
            name,
            description,
            inputType,
            specify,
            eventAction,
            actionDate
        ) {
            this.ID = ID,
            this.empQuestionnaireAnswerSetID = empQuestionnaireAnswerSetID,
            this.no = no,
            this.choiceOrder = choiceOrder,
            this.name = name,
            this.description = description,
            this.inputType = inputType,
            this.specify = specify,
            this.eventAction = eventAction,
            this.actionDate = actionDate
        }
    }

    QuestionnaireDoneAndSet = class {
        constructor(
            done,
            set,
            sections,
            questions,
            answersets,
            answers
        ) {
            this.done = done,
            this.set = set,
            this.sections = sections,
            this.questions = questions,
            this.answersets = answersets,
            this.answers = answers
        }
    }
}

class QuestionnaireDoneAndSet {
    async doGetList(PPID) {
        let db = new util.DB();
        let conn;
        let connRequest;
        
        try {
            conn = await db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
            connRequest = conn.request();
            connRequest.input('PPID', sql.VarChar, PPID);
        }
        catch {
        }
        
        let data = await db.doExecuteStoredProcedure(connRequest, 'sp_empGetListQuestionnaireDoneAndSet');
        let ds = [];

        if (data.dataset.length > 0) {
            let schema = new Schema();

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
        conn.close();

        return data;
    }

    async doGet(
        questionnaireDoneID,
        questionnaireSetID,
        PPID
    ) {
        let db = new util.DB(); 
        let conn;
        let connRequest;

        try {
            conn = await db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
            connRequest = conn.request();
            connRequest.input('empQuestionnaireDoneID', sql.VarChar, questionnaireDoneID);
            connRequest.input('empQuestionnaireSetID', sql.VarChar, questionnaireSetID);
            connRequest.input('PPID', sql.VarChar, PPID);
        }
        catch {
        }

        let data = await db.doExecuteStoredProcedure(connRequest, 'sp_empGetQuestionnaireDoneAndSet');
        let ds = [];
        let qtndone = null;
        let qtnset = null;
        let qtnsections = [];
        let qtnquestions = [];
        let qtnanswersets = [];
        let qtnanswers = [];
        let schema = new Schema();

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
                    JSON.parse(dr.empQuestionnaireAnswer),
                    dr.submitStatus,
                    dr.cancelStatus,
                    dr.actionDate,
                    dr.doneDate
                );
            });
            
            data.dataset[1].forEach(dr => {
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

            data.dataset[2].forEach(dr => {
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

            data.dataset[3].forEach(dr => {
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

            data.dataset[4].forEach(dr => {
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

            data.dataset[5].forEach(dr => {
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
            qtnset,
            qtnsections,
            qtnquestions,
            qtnanswersets,
            qtnanswers
        ));

        data.dataset = ds;
        conn.close();

        return data;
    }
}

class QuestionnaireDone {
    async doSet(
        method,
        jsonData
    ) {
        let db = new util.DB();
        let conn;
        let connRequest;
        
        try {
            conn = await db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
            connRequest = conn.request();
            connRequest.input('method', sql.VarChar, method);
            connRequest.input('jsonData', sql.NVarChar, jsonData);
        }
        catch {
        }

        let data = await db.doExecuteStoredProcedure(connRequest, 'sp_empSetQuestionnaireDone');
        let ds = [];

        if (data.dataset.length > 0)
            ds = data.dataset[0];

        data.dataset = ds;
        conn.close();

        return data;
    }
}

module.exports = {
    Schema: Schema,
    QuestionnaireDoneAndSet: QuestionnaireDoneAndSet,
    QuestionnaireDone: QuestionnaireDone
};