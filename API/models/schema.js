/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๓/๐๓/๒๕๖๕>
Modify date : <๐๓/๐๓/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

class Schema {
    Country = class {
        constructor(
            ID,
            name,
            isoCountryCodes2Letter,
            isoCountryCodes3Letter
        ) {
            this.ID = ID,
            this.name = name,
            this.isoCountryCodes2Letter = isoCountryCodes2Letter,
            this.isoCountryCodes3Letter = isoCountryCodes3Letter
        }
    };

    Province = class {
        constructor(
            ID,
            country,
            name,
            regional
        ) {
            this.ID = ID,
            this.country = country,
            this.name = name,
            this.regional = regional
        }
    };

    District = class {
        constructor(
            ID,
            country,
            province,
            name,
            zipCode
        ) {
            this.ID = ID,
            this.country = country,
            this.province = province,
            this.name = name,
            this.zipCode = zipCode
        }
    };

    Subdistrict = class {
        constructor(
            ID,
            country,
            province,
            district,
            name
        ) {
            this.ID = ID,
            this.country = country,
            this.province = province,
            this.district = district,
            this.name = name
        }
    }

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
    };

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
    };

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
    };

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
    };

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
    };

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
    };

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
    };

    Student = class {
        constructor(
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
            graduateYear,
			gender,
			birthDate,
			nationalityName,
			nationality2Letter,
			nationality3Letter,
			raceName,
			race2Letter,
			race3Letter
        ) {
            this.perPersonID = perPersonID,
			this.studentCode = studentCode,
			this.IDCard = IDCard,
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
            this.graduateYear = graduateYear,
			this.gender = gender,
			this.birthDate = birthDate,
			this.nationalityName = nationalityName,
			this.nationality2Letter = nationality2Letter,
			this.nationality3Letter = nationality3Letter,
			this.raceName = raceName,
			this.race2Letter = race2Letter,
			this.race3Letter = race3Letter
        }
    }
}

module.exports = new Schema();