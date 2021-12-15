/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๓/๐๙/๒๕๖๔>
Modify date : <๐๘/๑๒/๒๕๖๔>
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
            PPID,
            perPersonID,
            studentCode,
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
            race3Letter,
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
            this.titlePrefix = titlePrefix,
            this.firstName = firstName,
            this.middleName = middleName,
            this.lastName = lastName,
            this.instituteName = instituteName,
            this.facultyID = facultyID,
            this.facultyCode = facultyCode,
            this.facultyName = facultyName,
            this.programID = programID,
            this.programCode = programCode,
            this.majorCode = majorCode,
            this.groupNum = groupNum,
            this.degreeLevelName = degreeLevelName,
            this.programName = programName,
            this.degreeName = degreeName,
            this.branchID = branchID,
            this.branchName = branchName,
            this.classYear = classYear,
            this.yearEntry = yearEntry,
            this.gender = gender,
            this.birthDate = birthDate,
            this.nationalityName = nationalityName,
            this.nationality2Letter = nationality2Letter,
            this.nationality3Letter = nationality3Letter,
            this.raceName = raceName,
            this.race2Letter = race2Letter,
            this.race3Letter = race3Letter,
            this.address = address,
            this.empQuestionnaireAnswer = empQuestionnaireAnswer,
            this.cancelStatus = cancelStatus,
            this.actionDate = actionDate
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
            doneStatus,
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
            this.doneStatus = doneStatus,
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
            sectionOnOff,
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
            this.sectionOnOff = sectionOnOff,
            this.actionDate = actionDate
        }
    }

    QuestionnaireDoneAndSet = class {
        constructor(
            done,
            set,
            section,
            question,
            answerSet,
            answer
        ) {
            this.done = done,
            this.set = set,
            this.section = section,
            this.question = question,
            this.answerSet = answerSet,
            this.answer = answer
        }
    }
}

async function getList(PPID, perPersonID, studentCode) {
    let db = new util.DB();
    let conn;
    let connRequest;
    
    try {
        conn = await db.getConnectRequest(process.env.DB_DATABASE_BERMUDA);
        connRequest = conn.request();
        connRequest.input('PPID', sql.VarChar, PPID);
        connRequest.input('perPersonID', sql.VarChar, perPersonID);
        connRequest.input('studentCode', sql.VarChar, studentCode);
    }
    catch { }
    
    let data = await db.executeStoredProcedure(connRequest, 'sp_empGetListQuestionnaireDoneAndSet');
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
                dr.doneStatus,
                dr.doneDate,
                dr.actionDate
            ));
        });
    }

    data.dataset = ds;
    conn.close();

    return data;
}

async function get(PPID, perPersonID, studentCode, questionnaireSetID) {
    let db = new util.DB(); 
    let conn;
    let connRequest;

    try {
        conn = await db.getConnectRequest(process.env.DB_DATABASE_BERMUDA);
        connRequest = conn.request();
        connRequest.input('PPID', sql.VarChar, PPID);
        connRequest.input('perPersonID', sql.VarChar, perPersonID);
        connRequest.input('studentCode', sql.VarChar, studentCode);
        connRequest.input('empQuestionnaireSetID', sql.VarChar, questionnaireSetID);
    }
    catch { }

    let data = await db.executeStoredProcedure(connRequest, 'sp_empGetQuestionnaireDoneAndSet');
    let ds = [];
    let dsQuestionnaireDone = null;
    let dsQuestionnaireSet = null;
    let dsQuestionnaireSection = [];
    let dsQuestionnaireQuestion = [];
    let dsQuestionnaireAnswerSet = [];
    let dsQuestionnaireAnswer = [];
    let schema = new Schema();

    if (data.dataset.length > 0) {
        data.dataset[0].forEach(dr => {
            dsQuestionnaireDone = new schema.QuestionnaireDone(
                dr.ID,
                dr.empQuestionnaireSetID,
                dr.PPID,
                dr.perPersonID,
                dr.studentCode,
                {
                    th: dr.titlePrefixTH,
                    en: dr.titlePrefixEN
                },
                {
                    th: dr.firstNameTH,
                    en: dr.firstNameEN
                },
                {
                    th: dr.middleNameTH,
                    en: dr.middleNameEN
                },
                {
                    th: dr.lastNameTH,
                    en: dr.lastNameEN
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
                {
                    th: dr.degreeLevelNameTH,
                    en: dr.degreeLevelNameEN
                },
                {
                    th: dr.programNameTH,
                    en: dr.programNameEN
                },
                {
                    th: dr.degreeNameTH,
                    en: dr.degreeNameEN
                },
                dr.branchID,
                {
                    th: dr.branchNameTH,
                    en: dr.branchNameEN
                },
                dr.class,
                dr.yearEntry,
                dr.gender,
                dr.birthDate,
                {
                    th: dr.nationalityNameTH,
                    en: dr.nationalityNameEN
                },
                dr.nationality2Letter,
                dr.nationality3Letter,
                {
                    th: dr.raceNameTH,
                    en: dr.raceNameEN
                },
                dr.race2Letter,
                dr.race3Letter,
                dr.address,
                dr.empQuestionnaireAnswer,
                dr.cancelStatus,
                dr.actionDate
            );
        });

        data.dataset[1].forEach(dr => {
            dsQuestionnaireSet = new schema.QuestionnaireSet(
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
                dr.doneStatus,
                dr.doneDate,
                dr.actionDate
            );
        });

        data.dataset[2].forEach(dr => {
            dsQuestionnaireSection.push(new schema.QuestionnaireSection(
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
            dsQuestionnaireQuestion.push(new schema.QuestionnaireQuestion(
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
            dsQuestionnaireAnswerSet.push(new schema.QuestionnaireAnswerSet(
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
            dsQuestionnaireAnswer.push(new schema.QuestionnaireAnswer(
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
                JSON.parse(dr.sectionOnOff),
                dr.actionDate
            ));
        });
    }

    ds.push(new schema.QuestionnaireDoneAndSet(
        dsQuestionnaireDone,
        dsQuestionnaireSet,
        dsQuestionnaireSection,
        dsQuestionnaireQuestion,
        dsQuestionnaireAnswerSet,
        dsQuestionnaireAnswer
    ));

    data.dataset = ds;
    conn.close();

    return data;
}

module.exports = {
    Schema: Schema,
    getList: getList,
    get: get
};