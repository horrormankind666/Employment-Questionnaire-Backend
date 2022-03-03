/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๘/๐๑/๒๕๖๕>
Modify date : <๐๓/๐๓/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const sql = require('mssql');
const util = require('../util');
const schema = require('./schema');

class Student {
    async doGet(studentCode) {
        let conn;
        let connRequest;
        
        try {
            conn = await util.db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
            connRequest = conn.request();
            connRequest.input('studentCode', sql.VarChar, studentCode);
        }
        catch {
        }
        
        let data = await util.db.doExecuteStoredProcedure(connRequest, 'sp_empGetQuestionnaireStudentProfile');
        let ds = [];
        
        if (data.dataset.length > 0) {
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
                    dr.graduateYear,
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
}

module.exports = new Student();