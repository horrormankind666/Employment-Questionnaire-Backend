/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๘/๐๑/๒๕๖๕>
Modify date : <๒๘/๐๑/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const sql = require('mssql');
const util = require('../util');

class Schema {
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

async function doGet(studentCode) {
    let db = new util.DB();
    let conn;
    let connRequest;
    
    try {
        conn = await db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
        connRequest = conn.request();
        connRequest.input('studentCode', sql.VarChar, studentCode);
    }
    catch {
    }
    
    let data = await db.doExecuteStoredProcedure(connRequest, 'sp_empGetQuestionnaireStudentProfile');
    let ds = [];
    
    if (data.dataset.length > 0) {
        let schema = new Schema();

        data.dataset[0].forEach(dr => {
            ds.push(new schema.Student(
                dr.perPersonID,
                dr.studentCode,
                dr.IDCard,
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
                dr.classYear,
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
                dr.race3Letter
            ));
        });
    }
    
    data.dataset = ds;
    conn.close();
        
    return data;
}

module.exports = {
    Schema: Schema,
    doGet: doGet
};