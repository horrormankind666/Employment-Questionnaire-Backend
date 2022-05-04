/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๔/๐๓/๒๕๖๕>
Modify date : <๐๓/๐๕/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const sql = require('mssql');
const util = require('./util');

class Questionnaire {
    questionnaireSet = {
        ID:  'A1FBBC54-952E-4C5E-8372-63BA064490CE',
        year: 2563
    };
        
    datasource = {
        that: this,
        async doGetList() {
            let conn;
            let connRequest;
            
            try {
                conn = await util.db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
                connRequest = conn.request();
            }
            catch {
            }

            let query = 'select	  a.* ' +
                        'from	  Bermuda..empQuestionnaireAnswer as a with(nolock) inner join ' +
                        '         Bermuda..empQuestionnaireAnswerSet as b with(nolock) on a.empQuestionnaireAnswerSetID = b.ID inner join ' +
                        '         Bermuda..empQuestionnaireQuestion as c with(nolock) on b.empQuestionnaireQuestionID = c.ID inner join ' +
                        '         Bermuda..empQuestionnaireSection as d with(nolock) on c.empQuestionnaireSectionID = d.ID inner join ' +
                        '         Bermuda..empQuestionnaireSet as e with(nolock) on d.empQuestionnaireSetID = e.ID ' +
                        'where	  (e.ID = \'' + this.that.questionnaireSet.ID + '\') and ' +
                        '         (e.year = ' + this.that.questionnaireSet.year + ') and ' +
                        '         (e.showStatus = \'Y\') and ' +
                        '         (e.cancelStatus = \'N\') and ' +
                        '         (d.cancelStatus = \'N\') and ' +
                        '         (c.cancelStatus = \'N\') and ' +
                        '         (b.cancelStatus = \'N\') and ' +
                        '         (a.cancelStatus = \'N\') ' +
                        'order by d.no, c.no, b.no, a.no ' + 

                        'select id, ' +
                        '       countryNameTH, ' +
                        '       countryNameEN, ' +
                        '       isoCountryCodes2Letter, ' +
                        '       isoCountryCodes3Letter ' +
                        'from   Infinity..plcCountry with (nolock) '+

                        'select	a.id, ' +
                        '       a.plcCountryId, ' +
                        '       b.isoCountryCodes3Letter, ' +
                        '       a.provinceNameTH, ' +
                        '       a.provinceNameEN, ' +
                        '       a.regionalName ' +
                        'from	Infinity..plcProvince as a with (nolock) inner join ' +
                        '       Infinity..plcCountry as b with (nolock) on a.plcCountryId = b.id ' +
                        
                        'select	a.id, ' +
                        '       b.plcCountryId, ' +
                        '       c.isoCountryCodes3Letter, ' +
                        '       a.plcProvinceId, ' +
                        '       b.provinceNameTH, ' +
                        '       b.provinceNameEN, ' +
                        '       a.thDistrictName as districtNameTH, ' +
                        '       a.enDistrictName as districtNameEN, ' +
                        '       a.zipCode ' +
                        'from	Infinity..plcDistrict as a with (nolock) inner join ' +
                        '       Infinity..plcProvince as b with (nolock) on a.plcProvinceId = b.id inner join ' +
                        '       Infinity..plcCountry as c with (nolock) on b.plcCountryId = c.id ' +

                        'select	a.id, '+
                        '       c.plcCountryId, ' +
                        '       d.isoCountryCodes3Letter, ' +
                        '       b.plcProvinceId, ' +
                        '       c.provinceNameTH, ' +
                        '       c.provinceNameEN, ' +
                        '       a.plcDistrictId, ' +
                        '       b.thDistrictName as districtNameTH, ' +
                        '       b.enDistrictName as districtNameEN, ' +
                        '       b.zipCode, ' +
                        '       a.thSubdistrictName as subdistrictNameTH, ' +
                        '       a.enSubdistrictName as subdistrictNameEN ' +
                        'from	Infinity..plcSubdistrict as a with (nolock) inner join ' +
                        '       Infinity..plcDistrict as b with (nolock) on a.plcDistrictId = b.id inner join ' +
                        '       Infinity..plcProvince as c with (nolock) on b.plcProvinceId = c.id inner join ' +
                        '       Infinity..plcCountry as d with (nolock) on c.plcCountryId = d.id ' +

                        'select (right(\'0000\' + convert(varchar, a.rowNumber), 4)) as no, ' +
                        '       a.* ' +
                        'from	( ' +
                        '           select  row_number() over (order by a.id) as rowNumber, ' +
                        '                   h.idCard, ' +
                        '                   i.thTitleInitials as titlePrefixTH, ' +
                        '                   i.enTitleInitials as titlePrefixEN, ' +
                        '                   h.firstName as firstNameTH, ' +
                        '                   h.middleName as middleNameTH, ' +
                        '                   h.lastName as lastNameTH, ' +
                        '                   h.enFirstName as firstNameEN, ' +
                        '                   h.enMiddleName as middleNameEN, ' +
                        '                   h.enLastName as lastNameEN, ' +
                        '                   \'มหาวิทยาลัยมหิดล\' as instituteNameTH, ' +
                        '                   \'MAHIDOL UNIVERSITY\' as instituteNameEN, ' +
                        '                   f.thDegreeLevelName as degreeLevelNameTH, ' +
                        '                   f.enDegreeLevelName as degreeLevelNameEN, ' +
                        '                   d.degreeNameTh as degreeNameTH, ' +
                        '                   d.degreeNameEn as degreeNameEN, ' +
                        '                   e.id as branchID, ' +
                        '                   e.nameTh as branchNameTH, ' +
                        '                   e.nameEn as branchNameEN, ' +
                        '                   b.class as classYear, ' +
                        '                   b.yearEntry, ' +
                        '                   j.enGenderInitials as gender, ' +
                        '                   h.birthDate, ' +
                        '                   k.thNationalityName as nationalityNameTH, ' +
                        '                   k.enNationalityName as nationalityNameEN, ' +
                        '                   isnull(k.isoCountryCodes2Letter, k.enNationalityName) as nationality2Letter, ' +
                        '                   isnull(k.isoCountryCodes3Letter, k.enNationalityName) as nationality3Letter, ' +
                        '                   l.thNationalityName as raceNameTH, ' +
                        '                   l.enNationalityName as raceNameEN, ' +
                        '                   isnull(l.isoCountryCodes2Letter, l.enNationalityName) as race2Letter, ' +
                        '                   isnull(l.isoCountryCodes3Letter, l.enNationalityName) as race3Letter, ' +
                        '                   a.*, ' +
                        '                   m.pos_name as workPositionName, ' +
                        '                   isnull(n.[PROGRAM_NAME], a.FurtherStudyProgram) as furtherStudyProgramName ' +
                        '           from    Infinity..surQuestionaire as a with(nolock) inner join ' +
                        '                   Infinity..stdStudent as b with(nolock) on (a.personId = b.personId and a.studentId = b.id and a.studentCode = b.studentCode) left join ' +
                        '                   Infinity..acaFaculty as c with(nolock) on b.facultyId = c.id left join ' +
                        '                   Infinity..acaProgram as d with(nolock) on (b.facultyId = d.facultyId and b.programId = d.id) left join ' +
                        '                   Infinity..acaBranch as e with(nolock) on d.branchGroup = e.branchCode left join ' +
                        '                   Infinity..stdDegreeLevel as f with(nolock) on b.degree = f.id left join ' +
                        '                   Infinity..stdStatusType as g with(nolock) on b.status = g.id inner join ' +
                        '                   Infinity..perPerson as h with(nolock) on b.personId = h.id left join ' +
                        '                   Infinity..perTitlePrefix as i with(nolock) on h.perTitlePrefixId = i.id left join ' +
                        '                   Infinity..perGender as j with(nolock) on i.perGenderId = j.id left join ' +
                        '                   Infinity..perNationality as k with(nolock) on h.perNationalityId = k.id left join ' +
                        '                   Infinity..perNationality as l with(nolock) on h.perOriginId = l.id left join ' +
                        '                   ( ' +
                        '                       select	distinct ' +
                        '                               pos_id as pos_id, ' +
                        '                               ltrim(rtrim(pos_name)) as pos_name ' +
                        '                       from	Bermuda..MUA_REF_POSITION_CAREER with(nolock) ' +
                        '                   ) as m on a.WorkPosition = m.pos_id left join ' +
                        '                   ( '+
                        '                       select	distinct ' +
                        '                               PROGRAM_ID, ' +
                        '                               [PROGRAM_NAME] ' +
                        '                       from	Bermuda..MUA_REF_PROGRAM with(nolock) ' +
                        '                   ) as n on a.FurtherStudyProgram = n.PROGRAM_ID ' +
                        '           where   (b.studentCode = \'6011258\') and ' +
                        '                   (b.status in (\'100\', \'101\', \'102\')) and ' +
                        '                   (g.[group] = \'01\') and ' +
                        '                   (b.graduateYear is not null) and ' +
                        '                   (b.graduateDate is not null) and ' +
                        '                   (a.graduateYear = \'' + this.that.questionnaireSet.year + '\') ' +
                        '       ) as a';
            
            let data = await util.db.doExecuteQuery(connRequest, query);
            let datasource = {
                new: {
                    qtnanswers: [],
                    countries: [],
                    provinces: [],
                    districts: [],
                    subdistricts: []
                },
                old: {
                    dones: []
                }
            };
            
            if (data.dataset.length > 0)
                datasource = {
                    new: {
                        qtnanswers: data.dataset[0],
                        countries: data.dataset[1],
                        provinces: data.dataset[2],
                        districts: data.dataset[3],
                        subdistricts: data.dataset[4],
                    },
                    old: {
                        dones: data.dataset[5]
                    }
                };

            util.db.doConnClose(conn);

            return datasource;
        }
    };

    formatting = {
        tableName: null,
        data: null,
        country: {
            that: this,
            doSet() {
                let country = this.that.formatting.data;

                return {
                    ID: country.id,
                    name: {
                        th: country.countryNameTH,
                        en: country.countryNameEN
                    },
                    isoCountryCodes2Letter: country.isoCountryCodes2Letter,
                    isoCountryCodes3Letter: country.isoCountryCodes3Letter
                };
            }
        },
        province: {
            that: this,
            doSet() {
                let province = this.that.formatting.data;

                return {
                    ID: province.id,
                    country: {
                        ID: province.plcCountryId,
                        isoCountryCodes3Letter: province.isoCountryCodes3Letter
                    },
                    name: {
                        th: province.provinceNameTH,
                        en: province.provinceNameEN
                    },

                    regional: province.regionalName
                };
            }
        },
        district: {
            that: this,
            doSet() {
                let district = this.that.formatting.data;

                return {
                    ID: district.id,
                    country: {
                        ID: district.plcCountryId,
                        isoCountryCodes3Letter: district.isoCountryCodes3Letter
                    },
                    province: {
                        ID: district.plcProvinceId,
                        name: {
                            th: district.provinceNameTH,
                            en: district.provinceNameEN
                        }
                    },
                    name: {
                        th: district.districtNameTH,
                        en: district.districtNameEN
                    },
                    zipCode: district.zipCode 
                };
            }
        },
        subdistrict: {
            that: this,
            doSet() {
                let subdistrict = this.that.formatting.data;

                return {
                    ID: subdistrict.id,
                    country: {
                        ID: subdistrict.plcCountryId,
                        isoCountryCodes3Letter: subdistrict.isoCountryCodes3Letter
                    },
                    province: {
                        ID: subdistrict.plcProvinceId,
                        name: {
                            th: subdistrict.provinceNameTH,
                            en: subdistrict.provinceNameEN
                        }
                    },
                    district: {
                        ID: subdistrict.plcDistrictId,
                        name: {
                            th: subdistrict.districtNameTH,
                            en: subdistrict.districtNameEN
                        },
                        zipCode: subdistrict.zipCode
                    },
                    name: {
                        th: subdistrict.subdistrictNameTH,
                        en: subdistrict.subdistrictNameEN
                    }
                };
            }
        },
        questionnaireAnswer: {
            that: this,
            doSet() {
                let qtnanswer = this.that.formatting.data;
                
                return {
                    ID: qtnanswer.ID,
                    empQuestionnaireAnswerSetID: qtnanswer.empQuestionnaireAnswerSetID,
                    no: qtnanswer.no,
                    choiceOrder: qtnanswer.choiceOrder,
                    name: {
                        th: qtnanswer.nameTH,
                        en: qtnanswer.nameEN
                    },
                    description: {
                        th: qtnanswer.descriptionTH,
                        en: qtnanswer.descriptionEN
                    },
                    inputType: JSON.parse(qtnanswer.inputType),
                    specify: JSON.parse(qtnanswer.specify),
                    eventAction: JSON.parse(qtnanswer.eventAction),
                    actionDate: qtnanswer.actionDate
                };
            }
        },
        questionnaireAnswerSpecifyItem: {
            that: this,
            doSet() {
                return this.that.formatting.data;
            }
        },
        offeredAnswer: {
            that: this,
            qtnquestionID: null,
            errorStatus: null,
            qtnanswersetID: null,
            qtnanswerID: null,
            answer: null,
            answerOther: null,
            doSet() {
                let offeredAnswer = {
                    question: {
                        ID: this.qtnquestionID,
                        errorStatus: this.errorStatus
                    },
                    answerset: {
                        ID: this.qtnanswersetID
                    },
                    answer: {
                        ID: this.qtnanswerID,
                        value: this.answer
                    }
                };

                if (this.qtnanswerID !== null) {
                    let qtnanswerIDs = (Array.isArray(this.qtnanswerID) === false ? [this.qtnanswerID] : this.qtnanswerID);
                    
                    if (this.that.formatting.data !== null) {
                        let qtnanswer = null
                        let qtnanswerspecifies = [];
                        let qtnanswerspecifyitemspecifies = [];
                        let offeredanswerspecify = []
                        let datasource = Object.assign([], this.that.formatting.data);

                        qtnanswerIDs.forEach((qtnanswerID) => {
                            qtnanswer = this.that.doFilter('questionnaireAnswer', datasource, 'ID', qtnanswerID);

                            if (qtnanswer.specify !== undefined && qtnanswer.specify !== null)
                                qtnanswerspecifies.push(qtnanswer.specify);
                        });

                        if (qtnanswerspecifies[0] !== undefined)
                            qtnanswerspecifies = Object.assign([], qtnanswerspecifies[0]);

                        let specifies = [];
                        
                        if (this.answerOther !== null && this.answerOther.length > 0) {
                            qtnanswerspecifies.forEach((qtnanswerspecify, index) => {
                                let answerotherObj = this.answerOther[`${index}`];
                                
                                if (answerotherObj !== null && answerotherObj.value !== null)
                                    specifies.push({
                                        ID: qtnanswer.ID,
                                        value: answerotherObj.value
                                    });


                                if (qtnanswerspecify.items !== undefined) {
                                    let qtnanswerspecifyitems = Object.assign([], qtnanswerspecify.items);
                                    let answerothervalues = (Array.isArray(answerotherObj.value) === false ? [answerotherObj.value] : answerotherObj.value);
                                    
                                    answerothervalues.forEach((answerothervalue) => {
                                        qtnanswerspecifyitems.filter((dr) => dr.ID === answerothervalue).forEach((qtnanswerspecifyitem) => {
                                            if (qtnanswerspecifyitem.specify !== undefined && qtnanswerspecifyitem.specify !== null) {
                                                qtnanswerspecifyitemspecifies.push(qtnanswerspecifyitem);

                                                if (answerotherObj.specify !== undefined && answerotherObj.specify !== null) {
                                                    specifies[specifies.length - 1].specify = {
                                                        ID: answerothervalue,
                                                        value: answerotherObj.specify
                                                    };
                                                    offeredanswerspecify.push(specifies[specifies.length - 1]);
                                                }
                                            }
                                        });
                                    });
                                }

                            });
                        }

                        
                        let errorStatus = this.errorStatus;

                        if (qtnanswerspecifies.length === specifies.length) {
                            errorStatus = 'N';

                            if (specifies.length > 0)
                                errorStatus = (qtnanswerspecifyitemspecifies.length === offeredanswerspecify.length ? 'N' : 'Y');
                        }
                        else
                            errorStatus = 'Y';
                        
                        offeredAnswer.question.errorStatus = errorStatus;
                        
                        if (specifies.length > 0)
                            offeredAnswer.answer.specify = {
                                values: specifies
                            };
                    }
                }
                
                return offeredAnswer;
            }
        },
        doSet() {
            if (this.data !== null)
                return this[this.tableName].doSet();

            return null;
        }
    };

    doFilter(
        tableName,
        datasource,
        fieldSource,
        ID
    ) {
        let items = datasource.filter((dr) => dr[fieldSource] === ID);
        let item = (items.length > 0 ? items[0] : null);

        this.formatting.tableName = tableName;
        this.formatting.data = item;
        
        return this.formatting.doSet();
    }
        
    async doAction() {
        console.log('Get Questionnaire ( old ) From Infinity..surQuestionaire');

        util.spinner.style = util.spinner.styles.line;
        let cursorSpinner = util.spinner.start();

        let datasource = await this.datasource.doGetList();
                
        console.log('There are ' + datasource.old.dones.length + ' records of data.');
        
        if (datasource.old.dones.length > 0) {
            console.log('\nGet Questionnaire ( new ) From Bermuda..empQuestionnaireAnswer');

            if (datasource.new.qtnanswers.length > 0) {
                let qtndone;
                let qtnanswer;
                let qtnanswerspecifyitem;
                let qtnanswerID;
                let address;
                let answer;
                let answerOther;
                let offeredAnswer;

                console.log('Start Export Data From Infinity..surQuestionaire to Bermuda..empQuestionnairDone')
                
                datasource.old.dones.forEach((dr, index) => {
                    qtndone = null;
                    offeredAnswer = [];

                    //1. สถาบันการศึกษา
                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = '8EB152F0-705F-4639-9C52-9384BA62A0B5';
                    this.formatting.offeredAnswer.errorStatus = 'N';
                    this.formatting.offeredAnswer.qtnanswersetID = 'B01FB652-E3E2-4648-A20A-53F5F3C09DE9';
                    this.formatting.offeredAnswer.qtnanswerID = '1A3D05F1-605A-4692-BB2E-592BEA2577B3';
                    this.formatting.offeredAnswer.answer = 'institute';
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //2. ข้อมูลส่วนตัว
                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = 'E25C8EF2-EB06-4D4D-B892-44F29ACFB5E7';
                    this.formatting.offeredAnswer.errorStatus = 'N';
                    this.formatting.offeredAnswer.qtnanswersetID = '996720F2-E091-4884-ACE8-70F0576E9A96';
                    this.formatting.offeredAnswer.qtnanswerID = 'B862314D-0239-4AFD-B32B-2A162EA15E62';
                    this.formatting.offeredAnswer.answer = 'personal detail';
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //3. ที่อยู่ปัจจุบัน
                    address = {};

                    if (dr.AddrNo !== null && dr.AddrNo.length > 0)
                        address['adddressNo'] = dr.AddrNo;

                    if (dr.AddrMoo !== null && dr.AddrMoo.length > 0)
                        address['moo'] = dr.AddrMoo;

                    if (dr.AddrVillage !== null && dr.AddrVillage.length > 0)
                        address['village'] = dr.AddrVillage;
                    
                    if (dr.AddrSoi !== null && dr.AddrSoi.length > 0)
                        address['soi'] = dr.AddrSoi;

                    if (dr.AddrStreet !== null && dr.AddrStreet.length > 0)
                        address['road'] = dr.AddrStreet;
                    
                    answer = this.doFilter('country', datasource.new.countries, 'id', '217');

                    if (answer !== null)
                        address['country'] = {
                            ID: answer.ID
                        };
                    
                    if (dr.AddrProvince !== null && dr.AddrProvince.length > 0) {
                        answer = this.doFilter('province', datasource.new.provinces, 'id', dr.AddrProvince);

                        if (answer !== null)
                            address['province'] = {
                                ID: answer.ID
                            };
                    }

                    if (dr.AddrDistrict !== null && dr.AddrDistrict.length > 0) {
                        answer = this.doFilter('district', datasource.new.districts, 'id', dr.AddrDistrict);

                        if (answer !== null)
                            address['district'] = {
                                ID: answer.ID
                            };
                    }

                    if (dr.AddrSubDistrict !== null && dr.AddrSubDistrict.length > 0) {
                        answer = this.doFilter('subdistrict', datasource.new.subdistricts, 'id', dr.AddrSubDistrict);

                        if (answer !== null) 
                            address['subdistrict'] = {
                                ID: answer.ID
                            };
                    } 

                    if (dr.AddrZip !== null && dr.AddrZip.length > 0)
                        address['zipcode'] = dr.AddrZip;

                    if (dr.AddrTel !== null && dr.AddrTel.length > 0)
                        address['telephone'] = dr.AddrTel;

                    if (dr.Mobile !== null && dr.Mobile.length > 0)
                        address['mobilePhone'] = dr.Mobile;

                    if (dr.AddrFax !== null && dr.AddrFax.length > 0)
                        address['fax'] = dr.AddrFax;

                    if (dr.EMail !== null && dr.EMail.length > 0)
                        address['email'] = dr.EMail;
                    
                    answer = (Object.keys(address).length > 0 ? address : null);

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = '654D0942-E354-48DB-BEB6-657A303A9BA6';
                    this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '160FEEDE-390D-4367-B799-F5A1A494B77E';
                    this.formatting.offeredAnswer.qtnanswerID = '23B05F55-0C94-40E8-90EA-09A2768B1322';
                    this.formatting.offeredAnswer.answer = answer;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //4. ภูมิลำเนาอยู่จังหวัด
                    answer = this.doFilter('province', datasource.new.provinces, 'id', dr.HomeProvince);
                    
                    if (answer !== null)
                        answer = {
                            ID: answer.ID
                        }

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = '62B4913B-9FEA-4EC8-8B4E-1C894154D7F1';
                    this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '5CCD5877-0F83-4916-BBCF-F445E7CCEA21';
                    this.formatting.offeredAnswer.qtnanswerID = 'F164933D-FAB4-452B-95FC-1C0715C55FB7';
                    this.formatting.offeredAnswer.answer = answer;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //5. สถานะการเกณฑ์ทหาร ( เฉพาะเพศชาย )
                    switch (dr.SoldierSts) {
                        case '0':
                        case '00':
                            qtnanswerID = 'B55CFEA4-A620-45ED-A6CD-A3102E498111';
                            break;
                        case '1':
                        case '01':
                            qtnanswerID = '5A32AC09-EB45-4315-B4EC-501FDB39C187';
                            break;
                        default: 
                            qtnanswerID = null;
                            break;
                    }

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = '654E54A8-19CD-4F98-BB2F-13C9746B3F6D';
                    this.formatting.offeredAnswer.errorStatus = (dr.gender === 'F' ? 'N' : (qtnanswerID !== null ? 'N' : 'Y'));
                    this.formatting.offeredAnswer.qtnanswersetID = '564B8E23-0FE8-45C9-A303-B84A7B0AE98F';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //6. สถานะการเป็นนักบวช
                    switch (dr.MonkSts) {
                        case '1': 
                        case '01':
                            qtnanswerID = '7C0875C9-A4E5-4824-A472-8F0891AA1BDD';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = '4232C71B-F785-44A5-A6BD-EB8ACEC4722B';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = '57CF0636-BE7C-4345-8D59-6FC6B656D49A';
                            break;
                        case '4':
                        case '04':
                            qtnanswerID = '3CCDDF72-29DC-4EAE-BD9A-2B1DCC07216F';
                            break;
                        case '5':
                        case '05':
                            qtnanswerID = '5B361327-FCD2-4635-ADF9-A5899D87B736';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = '503D964B-0745-4597-B2F2-D84465F66507';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '0322A0CF-9F3C-45A7-BDB1-BBFDF7FEDA4E';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //7. สถานภาพการทำงานปัจจุบัน
                    switch (dr.WorkSts) {
                        case '1':
                        case '01':
                            qtnanswerID = '8F99EC21-199C-494B-A5FC-7C28E77BC129';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = '77BA20DA-64AA-4813-91D5-5B10AF033790';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = '0BD5FFDD-A978-401C-98AD-D5201581F7D6';
                            break;
                        case '4':
                        case '04':
                            qtnanswerID = 'C0E84789-05BC-4611-BC50-DE0F218F45AE';
                            break;
                        case '5':
                        case '05':
                            qtnanswerID = 'A4D9FF4C-3016-4C77-919C-097081294298';
                            break;
                        case '6':
                        case '06':
                            qtnanswerID = '864C099F-EBDE-44F6-8100-227C6A535657';
                            break;
                        case '7':
                        case '07':
                            qtnanswerID = '6E607A23-3011-4A0A-8F8B-0666B33F0CB3';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = 'F94EB6F6-938C-4929-9CD4-30E39AF922E7';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '6E835978-6BC6-491E-9E8B-75A9B70E2B8A';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //8. ประเภทงานที่ทำ
                    switch (dr.WorkType) {
                        case '1':
                        case '01':
                            qtnanswerID = '1C78CC41-12D6-46CC-9BEC-701E261419D8';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = 'CFFE7E83-84D4-4738-A369-C9F7B918C6C3';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = '136A99E9-1157-4160-A64E-8DEA84BB4761';
                            break;
                        case '4':
                        case '04':
                            qtnanswerID = '71106F5F-2E09-4559-A04B-8877265292C5';
                            break;
                        case '5':
                        case '05':
                            qtnanswerID = '8889F9E5-6D73-45F0-8016-E9F4282409CB';
                            break;
                        case '0':
                        case '00':
                            qtnanswerID = '4158CB3F-DE6A-4F40-86E1-DDBEBE0F24D8';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answerOther = [];

                    if (dr.WorkTypeOther !== null)
                        answerOther.push({
                            value: dr.WorkTypeOther
                        });

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '59A0D811-B84E-4275-82AD-4CF2AD96F2F5';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '5B2F1FD9-1220-4CFE-92E8-5608D201F116';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null,
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //9. ท่านคิดว่า ความรู้ความสามารถพิเศษด้านใดที่ช่วยให้ท่านได้ทำงาน
                    switch (dr.SkillType) {
                        case '1':
                        case '01':
                            qtnanswerID = '68F20062-F4F2-4BA8-8E35-DCE1F3D41A5E';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = '60632A36-EA10-4C93-9689-0403976A4AF0';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = '7AEA0F32-101A-4FA8-B0B8-8B5C8DF5EE5B';
                            break;
                        case '4':
                        case '04':
                            qtnanswerID = '2682CE5B-7E62-4665-84C1-5CB98C75ADB4';
                            break;
                        case '5':
                        case '05':
                            qtnanswerID = '43722083-13E2-4B83-8720-B68B84684E47';
                            break;
                        case '6':
                        case '06':
                            qtnanswerID = 'ACB3BB0A-AF08-44FD-9585-D330EC943CB2';
                            break;
                        case '0':
                        case '00':
                            qtnanswerID = '447ABA98-9417-453E-8987-A0F669E502C0';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }
                    
                    answerOther = [];

                    if (dr.SkillTypeOther !== null)
                        answerOther.push({
                            value: dr.SkillTypeOther
                        });

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '1E974E8C-C5DC-442B-A39D-9C96C7B2C563';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '17AA93E5-B3AF-4CAA-BD5B-6E8073CE7551';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //10. ตำแหน่งงานที่ทำ
                    qtnanswerID = 'BCE0C112-7F15-413E-9AD1-C20B2F4CE316';
                    answerOther = [];

                    if (dr.workPositionName !== null || dr.WorkPositionOther !== null) {
                        if (dr.workPositionName !== null) {
                            qtnanswerID = 'BCE0C112-7F15-413E-9AD1-C20B2F4CE316';
                            answerOther.push({
                                value: {
                                    name: dr.workPositionName
                                }
                            });
                        }

                        if (dr.workPositionName === null && dr.WorkPositionOther !== null) {
                            qtnanswerID = '1F7AEDB1-0CC5-4038-BC3C-C63F77072DB5';
                            answerOther.push({
                                value: dr.WorkPositionOther
                            });
                        }
                    }
                    
                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = 'C0A5FAF4-F7F1-4E67-A209-9206F4E762A3';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '75BBF9F2-71F6-4A92-B6C1-0FD687E6EA6C';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //11. สถานที่ทำงานปัจจุบัน
                    // 1. ชื่อหน่วยงาน 
                    answer = dr.WorkInstitute;

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = '8937D43E-6104-4767-B87A-98DA6026CE49';
                    this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '9E8A5AF7-68D7-49A3-8DCD-98D480B93CF3';
                    this.formatting.offeredAnswer.qtnanswerID = 'A6561552-DCA4-4055-A6D5-F3E1697E4506';
                    this.formatting.offeredAnswer.answer = answer;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //11. สถานที่ทำงานปัจจุบัน
                    // 2. ประเภทกิจการ
                    switch (dr.WorkInstituteType) {
                        case 'A':
                            qtnanswerID = '2EBAFB18-180E-49F7-8E31-F124668101A4';
                            break;
                        case 'B':
                            qtnanswerID = '1D7C6B43-4D4E-4491-80D5-5D3464F00EC7';
                            break;
                        case 'C':
                            qtnanswerID = '26E1F159-C8C5-4C4D-844A-EA2360EFAF89';
                            break;
                        case 'D':
                            qtnanswerID = 'EFBA4FB6-B92F-469A-AA77-203CC648F6FF';
                            break;
                        case 'E':
                            qtnanswerID = '0F1C980C-DFDF-4E38-869D-12F52E8EA05C';
                            break;
                        case 'F':
                            qtnanswerID = 'D344B5A2-D949-40BA-908E-71571141CCF1';
                            break;
                        case 'G':
                            qtnanswerID = '8B2AAA16-4585-4F1D-B064-605815C120AC';
                            break;
                        case 'H':
                            qtnanswerID = '9B8EDF36-BB65-49A2-B117-A061F6EF4950';
                            break;
                        case 'I':
                            qtnanswerID = '3695EE70-548A-4449-8EBC-C5ACAA07CF0A';
                            break;
                        case 'J':
                            qtnanswerID = '8C817D96-1D7F-4FF3-B7DA-20D52461509D';
                            break;
                        case 'K':
                            qtnanswerID = '87E648F1-530B-4B18-9D37-9A024D2B2A47';
                            break;
                        case 'L':
                            qtnanswerID = 'C7309B48-CCDA-4A8F-BE18-6BC6274BB200';
                            break;
                        case 'M':
                            qtnanswerID = '7535DEB6-0A49-4879-853A-767EB0D1065E';
                            break;
                        case 'N':
                            qtnanswerID = '00D9BB0E-009B-46EA-850B-485F528489C7';
                            break;
                        case 'O':
                            qtnanswerID = 'BDD35648-7656-4176-A5BA-151D4A43F2FD';
                            break;
                        case 'P':
                            qtnanswerID = '0A6A5C25-15CA-4195-9AB2-1679A4C25EC2';
                            break;
                        case 'Q':
                            qtnanswerID = '68430183-83E8-44B6-9804-6B631D86A370';
                            break;
                        case 'R':
                            qtnanswerID = '6A0300A6-0382-4AF1-BDC8-FA921C44BD52';
                            break;
                        case 'S':
                            qtnanswerID = 'AB9DE7A1-FE58-47B3-8B1E-95C41B6AC45A';
                            break;
                        case 'T':
                            qtnanswerID = 'D7708572-DD77-4BE5-8F6F-B47EB41CB5C5';
                            break;
                        case 'U':
                            qtnanswerID = '58C26EEE-457E-4CBE-B92A-69F4D42F8A9E';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '8937D43E-6104-4767-B87A-98DA6026CE49';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '0E6DA439-00DF-4DDC-8EAB-FF740D2357E5';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //11. สถานที่ทำงานปัจจุบัน
                    // 3. ที่ตั้งสถานที่ทำงาน
                    address = {};
                    
                    if (dr.WorkAddr !== null && dr.WorkAddr.length > 0)
                        address['adddressNo'] = dr.WorkAddr;

                    if (dr.WorkMoo !== null && dr.WorkMoo.length > 0)
                        address['moo'] = dr.WorkMoo;

                    if (dr.WorkBuilding !== null && dr.WorkBuilding.length > 0)
                        address['building'] = dr.WorkBuilding;

                    if (dr.WorkFloor !== null && dr.WorkFloor.length > 0)
                        address['floors'] = dr.WorkFloor;

                    if (dr.WorkSoi !== null && dr.WorkSoi.length > 0)
                        address['soi'] = dr.WorkSoi;

                    if (dr.WorkRoad !== null && dr.WorkRoad.length > 0)
                        address['road'] = dr.WorkRoad;

                    answer = this.doFilter('country', datasource.new.countries, 'id', (dr.WorkCountry !== null ? dr.WorkCountry : '217'));

                    if (answer !== null)
                        address['country'] = {
                            ID: answer.ID
                        };

                    if (dr.WorkProvince !== null && dr.WorkProvince.length > 0) {
                        answer = this.doFilter('province', datasource.new.provinces, 'id', dr.WorkProvince);

                        if (answer !== null)
                            address['province'] = {
                                ID: answer.ID
                            };
                    }

                    if (dr.WorkDistrict !== null && dr.WorkDistrict.length > 0) {
                        answer = this.doFilter('district', datasource.new.districts, 'id', dr.WorkDistrict);

                        if (answer !== null)
                            address['district'] = {
                                ID: answer.ID
                            };
                    }

                    if (dr.WorkSubDistrict !== null && dr.WorkSubDistrict.length > 0) {
                        answer = this.doFilter('subdistrict', datasource.new.subdistricts, 'id', dr.WorkSubDistrict);

                        if (answer !== null) 
                            address['subdistrict'] = {
                                ID: answer.ID
                            };
                    } 

                    if (dr.WorkZip !== null && dr.WorkZip.length > 0)
                        address['zipcode'] = dr.WorkZip;

                    if (dr.WorkPhone !== null && dr.WorkPhone.length > 0)
                        address['telephone'] = dr.WorkPhone;

                    if (dr.WorkFax !== null && dr.WorkFax.length > 0)
                        address['fax'] = dr.WorkFax;

                    if (dr.WorkEmail !== null && dr.WorkEmail.length > 0)
                        address['email'] = dr.WorkEmail;

                    answer = (Object.keys(address).length > 0 ? address : null);

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = '8937D43E-6104-4767-B87A-98DA6026CE49';
                    this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '8167FD68-5883-4605-BF4D-05B98503427E';
                    this.formatting.offeredAnswer.qtnanswerID = '5EDD90EB-B474-4887-8F07-820CDE66DE67';
                    this.formatting.offeredAnswer.answer = answer;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //12. เงินเดือนหรือรายได้
                    switch (dr.IncomeSts) {
                        case '1':
                        case '01':
                            qtnanswerID = '4FEA5576-F78F-4DC2-AC0A-F559538BDC72';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = 'E19C00B0-6EF1-4E8F-9379-35BACFAC2204';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answerOther = [];

                    if (dr.IncomeAmt !== null)
                        answerOther.push({
                            value: dr.IncomeAmt
                        });

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = 'BAE0A726-6025-419F-BFF7-C86DA550EB49';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = 'C140580C-B5C4-4095-9F33-E58A5F2FC7F6';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //13. เงินเดือนหรือรายได้ที่ท่านได้รับ ท่านเห็นว่ามีความเหมาะสมกับคุณวุฒิหรือสาขาวิชาที่สำเร็จการศึกษาหรือไม่
                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = '7D11FA2C-3E7F-4B3A-A63B-A9161BBF9AD4';
                    this.formatting.offeredAnswer.errorStatus = 'Y';
                    this.formatting.offeredAnswer.qtnanswersetID = '6767BFDD-CF70-4FEF-B49D-60B7C3807F09';
                    this.formatting.offeredAnswer.qtnanswerID = null;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //14. ท่านมีความพอใจต่องานที่ทำหรือไม่
                    switch (dr.NonSatisfyType) {
                        case '1':
                        case '01':
                            qtnanswerID = '662DE9FC-997F-4983-AF5D-72F0B75A2D5E';
                            break;
                        case '2':
                        case '02':
                        case '3':
                        case '03':
                        case '4':
                        case '04':
                        case '5':
                        case '05':
                        case '6':
                        case '06':
                        case '7':
                        case '07':
                        case '0':
                        case '00':
                            qtnanswerID = '5076EA76-056B-4407-A7CF-12F40DEC2AC4';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answer = this.doFilter('questionnaireAnswer', datasource.new.qtnanswers, 'ID', qtnanswerID);
                    answerOther = [];

                    if (answer !== null && answer.specify !== null && answer.specify.length > 0) {
                        if (answer.specify[0].items !== undefined) {
                            switch (dr.NonSatisfyType) {
                                case '2':
                                case '02':
                                    qtnanswerID = '5076EA76-056B-4407-A7CF-12F40DEC2AC4-01';
                                    break;
                                case '3':
                                case '03':
                                    qtnanswerID = '5076EA76-056B-4407-A7CF-12F40DEC2AC4-02';
                                    break;
                                case '4':
                                case '04':
                                    qtnanswerID = '5076EA76-056B-4407-A7CF-12F40DEC2AC4-03';
                                    break;
                                case '5':
                                case '05':
                                    qtnanswerID = '5076EA76-056B-4407-A7CF-12F40DEC2AC4-04';
                                    break;
                                case '6':
                                case '06':
                                    qtnanswerID = '5076EA76-056B-4407-A7CF-12F40DEC2AC4-05';
                                    break;
                                case '7':
                                case '07':
                                    qtnanswerID = '5076EA76-056B-4407-A7CF-12F40DEC2AC4-06';
                                    break;
                                case '0':
                                case '00':
                                    qtnanswerID = '5076EA76-056B-4407-A7CF-12F40DEC2AC4-00';
                                    break;
                                default:
                                    qtnanswerID = null;
                                    break
                            }

                            answerOther.push({
                                ID: answer.ID,
                                value: qtnanswerID,
                                specify: dr.NonSatisfyOther
                            });
                        }

                        qtnanswerID = answer.ID;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '68D75734-1992-4C19-BCF3-920DE6CDEF61';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '886023B2-86B5-435B-9E35-C3AE113539F1';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID,
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //15. หลังจากสำเร็จการศึกษาแล้ว ท่านได้งานทำในระยะเวลาเท่าไร
                    switch (dr.GetWorkTime) {
                        case '1':
                        case '01':
                            qtnanswerID = '48F53350-DD79-464A-B101-157B5CA6AC4B';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = '88AAC8C4-1BCC-4251-AE2B-7C3E9E47A704';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = '5F09F102-9B96-448D-80FE-F44F78B9661B';
                            break;
                        case '4':
                        case '04':
                            qtnanswerID = 'C7AA3875-D5A3-4D4C-8734-4E05A8EB7C59';
                            break;
                        case '5':
                        case '05':
                            qtnanswerID = 'A8D1770E-4A3D-48E8-A98B-E1CC6548FE99';
                            break;
                        case '6':
                        case '06':
                            qtnanswerID = '7065F8F5-B7F1-49F5-A305-7D11EBC5CEC7';
                            break;
                        case '7':
                        case '07':
                            qtnanswerID = 'C06F4EB2-10BF-4B80-A82B-9C9EF61E8E32';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '08A5E48F-17A6-4C7B-8896-0C39A6FA5C14';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = 'F1392DF7-3ADF-4973-91AE-B1CFEF70CC5B';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //16. ท่านได้งานทำด้วยวิธีใด
                    switch (dr.HowGetJob) {
                        case '1':
                        case '01':
                            qtnanswerID = 'E8362F0B-E57F-4C3F-9AF6-94836E33EF9D';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = '2DA17CCA-4B0A-4F35-86BC-61E15E83F0DA';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = 'A45757B0-E6D1-435C-9631-FB2DCBE95867';
                            break;
                        case '4':
                        case '04':
                            qtnanswerID = '7543B9CF-9920-487C-BBC9-97CE2AFACBE7';
                            break;
                        case '5':
                        case '05':
                            qtnanswerID = '73F8B9DC-5123-4147-9FBE-F5B5FA60A3CB';
                            break;
                        case '0':
                        case '00':
                            qtnanswerID = '9A2B163C-8EA5-4635-9CEF-26DB73C611C8';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answerOther = [];

                    if (dr.HowGetJobOther !== null)
                        answerOther.push({
                            value: dr.HowGetJobOther
                        });

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = 'C574E67E-A9CC-4990-A52C-38C4C3F2698B';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = 'C5F576BD-1551-494B-A559-4AEABBD76860';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //17. ลักษณะงานที่ทำตรงกับสาขาที่ท่านได้สำเร็จการศึกษาหรือไม่
                    switch (dr.CareerRelateEdSts) {
                        case '1':
                        case '01':
                            qtnanswerID = 'BB5008AC-39AC-412C-A33A-FFDE8691BD0F';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = '8D84E622-D310-41C5-974F-25CD21110DF3';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '65EFB2BA-7894-458D-A608-249DD4AA03BD';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '065A87D2-8236-4172-86DA-7C678E4F89E4';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //18. ท่านสามารถนำความรู้จากสาขาวิชาที่เรียนมาประยุกต์ใช้กับหน้าที่การงานที่ทำอยู่ขณะนี้เพียงใด
                    switch (dr.ApplyLevel) {
                        case '1':
                        case '01':
                            qtnanswerID = '53C4FAEC-5403-4F9B-A506-F7F92EC665A8';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = '62404A5C-4C87-49BE-832E-0316F163967E';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = 'B290C157-5E53-413A-BE83-86C87B85D658';
                            break;
                        case '4':
                        case '04':
                            qtnanswerID = 'DF4D692F-91AC-4283-BA98-A9FC14119A30';
                            break;
                        case '5':
                        case '05':
                            qtnanswerID = '227811A5-C015-4AA0-8B11-EA5A486EC0FC';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '9C1EC3E4-0518-416F-8A0B-F28F44B4B536';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = 'E8F41951-C9AB-473C-93CA-CCE29A3C6FF6';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //19. การศึกษาต่อ
                    switch (dr.FurtherStudySts) {
                        case '1':
                        case '01':
                            qtnanswerID = 'FE8EEAD5-D483-4934-896C-6DC6F4A805DA';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = '33552DBE-CEE2-4374-8EB0-93455D68B21A';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = 'A7613F98-4009-4D35-B7AA-42ED07FC545B';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = 'C50B22BD-771B-4D31-B521-9C29A525DE10';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //20. สาเหตุที่ยังไม่ได้ทำงาน โปรดระบุสาเหตุที่สำคัญ 1 ข้อ ต่อไปนี้
                    switch (dr.NotWorkReason) {
                        case '1': 
                        case '01':
                            qtnanswerID = '593A9678-CC06-4A04-A67E-7F624AC126F3';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = 'FECA8645-E827-4170-A89B-F445BAA6C3C2';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = '03F37835-4217-4FB2-9DD0-A51C0E4FF950';
                            break;
                        case '4':
                        case '04':
                            qtnanswerID = '88A9635A-532F-44D0-8D53-48F4FFA107F6';
                            break;
                        case '0':
                        case '00':
                            qtnanswerID = '07B3FB95-D4B8-417C-BBE3-4B28418E4A03';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answerOther = [];

                    if (dr.NotWorkOther !== null)
                        answerOther.push({
                            value: dr.NotWorkOther
                        });

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '36210D2E-69D6-4572-A7C2-ACEEBF7890B7';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '9D7CD702-9AA9-4D5A-AC90-146843EBBD9F';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //21. ท่านมีปัญหาในการหางานทำหลังสำเร็จการศึกษาหรือไม่ 
                    switch (dr.FindJobProblem) {
                        case '1':
                        case '01':
                            qtnanswerID = 'F624BF5B-8FBA-43B9-A16E-ABCA878E05AD';
                            break;
                        case '2':
                        case '02':
                        case '3':
                        case '03':
                        case '4':
                        case '04':
                        case '5':
                        case '05':
                        case '6':
                        case '06':
                        case '7':
                        case '07':
                        case '8':
                        case '08':
                        case '9':
                        case '09':
                        case '10':
                        case '11':
                        case '12':
                        case '13':
                        case '14':
                        case '0':
                        case '00':
                            qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answer = this.doFilter('questionnaireAnswer', datasource.new.qtnanswers, 'ID', qtnanswerID);
                    answerOther = [];

                    if (answer !== null && answer.specify !== null && answer.specify.length > 0) {
                        if (answer.specify[0].items !== undefined) {
                            switch (dr.FindJobProblem) {
                                case '2':
                                case '02':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-01';
                                    break;
                                case '3':
                                case '03':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-02';
                                    break;
                                case '4':
                                case '04':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-03';
                                    break;
                                case '5':
                                case '05':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-04';
                                    break;
                                case '6':
                                case '06':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-05';
                                    break;
                                case '7':
                                case '07':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-06';
                                    break;
                                case '8':
                                case '08':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-07';
                                    break;
                                case '9':
                                case '09':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-08';
                                    break;
                                case '10':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-09';
                                    break;
                                case '11':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-10';
                                    break;
                                case '12':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-11';
                                    break;
                                case '13':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-12';
                                    break;
                                case '14':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-13';
                                    break;
                                case '0':
                                case '00':
                                    qtnanswerID = '506F68A8-F0FD-4EC8-B16B-6C516DCA675D-00';
                                    break;
                                default:
                                    qtnanswerID = null;
                                    break
                            }

                            answerOther.push({
                                ID: answer.ID,
                                value: (qtnanswerID !== null ? [qtnanswerID] : qtnanswerID),
                                specify: dr.FindJobProblemOther
                            });
                        }

                        qtnanswerID = answer.ID;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = 'C84659AA-0C02-425F-87A4-FE2B16E8C589';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = 'C9DBEB3E-A11B-4A25-A49F-398A2D9D49B5';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //22. ความต้องการทำงาน
                    switch (dr.Oversea) {
                        case '1':
                        case '01':
                            qtnanswerID = 'B81F9030-EFEA-49EF-8AC4-5D9B91A60805';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = 'F30B10D8-8ADC-44A5-ADBA-9395E6B9D006';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answerOther = [];

                    if (dr.OverseaCountry !== null) {
                        let country = Object.assign({}, this.doFilter('country', datasource.new.countries, 'id', dr.OverseaCountry));

                        if (country !== null && country.ID !== undefined)
                            answerOther.push({
                                value: {
                                    ID: country.ID
                                }
                            });
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = 'D97B9247-2BA2-4A3D-9E4E-348E15DC9EC2';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = 'D13D1898-4EBC-4D72-B526-0C77F4C69CF8';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //23. ตำแหน่งที่ต้องการทำงาน
                    answer = dr.PreferPosition;

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = 'D0B21F98-E468-4916-AC09-DE9F65F02B6F';
                    this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = 'F261FB0E-B698-4EDD-8BC3-13679CF85BDC';
                    this.formatting.offeredAnswer.qtnanswerID = '88170CC4-4054-467D-B2F6-93886B4429D5';
                    this.formatting.offeredAnswer.answer = answer;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //24. ความต้องการพัฒนาทักษะ หลักสูตร
                    answer = dr.ImproveSkill;

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = 'C63C0784-30C8-4233-97D0-7B363092C4CC';
                    this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '0725016B-74C0-4DA7-B7ED-E8C4CFF76ADD';
                    this.formatting.offeredAnswer.qtnanswerID = '0415BA6A-4E6E-481B-86EF-F02730FF8F4D';
                    this.formatting.offeredAnswer.answer = answer;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //25. ความประสงค์ในการเปิดเผยข้อมูลแก่นายจ้าง / สถานประกอบการ เพื่อพิจารณาบรรจุงาน
                    switch (dr.RevealInfo) {
                        case '0':
                        case '00':
                            qtnanswerID = '0332CB29-F307-4883-AAF4-6D50AFFD3100';
                            break;
                        case '1':
                        case '01':
                        case '2':
                        case '02':
                        case '3':
                        case '03':
                        case '4':
                        case '04':
                            qtnanswerID = '9C0B98E4-7B63-4FD3-B888-CF1B7BBE7BD1';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answer = this.doFilter('questionnaireAnswer', datasource.new.qtnanswers, 'ID', qtnanswerID);
                    answerOther = [];

                    if (answer !== null && answer.specify !== null && answer.specify.length > 0) {
                        if (answer.specify[0].items !== undefined) {
                            switch (dr.RevealInfo) {
                                case '1':
                                case '01':
                                    qtnanswerID = '9C0B98E4-7B63-4FD3-B888-CF1B7BBE7BD1-01';
                                    break;
                                case '2':
                                case '02':
                                    qtnanswerID = '9C0B98E4-7B63-4FD3-B888-CF1B7BBE7BD1-02';
                                    break;
                                case '3':
                                case '03':
                                    qtnanswerID = '9C0B98E4-7B63-4FD3-B888-CF1B7BBE7BD1-03';
                                    break;
                                case '4':
                                case '04':
                                    qtnanswerID = '9C0B98E4-7B63-4FD3-B888-CF1B7BBE7BD1-04';
                                    break;
                                default:
                                    qtnanswerID = null;
                                    break
                            }

                            answerOther.push({
                                ID: answer.ID,
                                value: qtnanswerID
                            });
                        }

                        qtnanswerID = answer.ID;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '3B21618B-DB37-40F7-A6B1-EE0FC11C7652';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '8FF49A7A-2937-49AD-847D-D1CD16587CD8';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //26. การศึกษาต่อ 
                    switch (dr.FurtherStudySts) {
                        case '1': 
                        case '01':
                            qtnanswerID = 'B6C9D18E-D942-4484-8D15-76E17D73D8AD';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = '7D9CA3D7-A1BE-44D5-BBAF-CFA2A61F05E1';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '4A7556CD-B9D9-4412-8653-2CA1306D27CD';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '23BABA35-8F8B-4070-9A80-058ABC896B6E';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //27. ระดับการศึกษาที่ท่านต้องการศึกษาต่อ / กำลังศึกษาต่อ
                    switch (dr.FurtherStudyLevel) {
                        case '4':
                        case '40':
                            qtnanswerID = '89DEEBCF-5FBF-47CB-B8F3-0BEE0D2CCB3B';
                            break;
                        case '5':
                        case '50':
                            qtnanswerID = '9F4F6921-B937-40F7-BD8D-5074F6534FD1';
                            break;
                        case '6':
                        case '60':
                            qtnanswerID = '1ED0C653-2CB9-4BC5-8D54-4BF9FCD8BA2C';
                            break;
                        case '7':
                        case '70':
                            qtnanswerID = 'E17B809D-E818-4717-8A3B-58EA7B3F4789';
                            break;
                        case '8':
                        case '80':
                            qtnanswerID = 'C4B903EF-2088-4E50-B880-954967F5F649';
                            break;
                        case '9':
                        case '90':
                            qtnanswerID = '3E02A465-D6CF-4C29-8C7C-85ECA5BB4DD4';
                            break;
                        case '0':
                        case '00':
                            qtnanswerID = 'D48F2BE7-58C8-43F5-8CF9-94A5C7F4EE3A';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answerOther = [];

                    if (dr.OtherStudyLevel !== null)
                        answerOther.push({
                            value: dr.OtherStudyLevel
                        });

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '829679C9-01D1-428D-8771-8AA3667270B7';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = 'BB82917E-1B6A-4929-BBD2-7FE705C546AB';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //28. สาขาวิชาที่ท่านต้องการศึกษาต่อ / กำลังศึกษาต่อ 
                    switch (dr.FurtherProgramFlag) {
                        case '1':
                        case '01':
                            qtnanswerID = '4BE18FBB-1A79-445F-BF70-87F46B2F93D0';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = '3EB93A24-4495-4A5C-98B5-2F7B1C9D9A9E';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answerOther = [];

                    if (dr.FurtherStudyProgram !== null)
                        answerOther.push({
                            value: dr.furtherStudyProgramName
                        });
                    
                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = 'BA37072A-82B8-4653-AF5E-367105FFEEA7';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '2383CE26-4628-4B4E-9A5D-6B4B9081A545';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //29. ประเภทของสถาบันการศึกษา / มหาวิทยาลัยที่ท่านต้องการศึกษา / กำลังศึกษาต่อ
                    // 1. ประเภทของสถาบันการศึกษา / มหาวิทยาลัยที่ท่านต้องการศึกษา 
                    switch (dr.FurtherStudyInstType) {
                        case '1':
                        case '01':
                            qtnanswerID = '40E574FB-4B3E-4A5F-952F-D30E97F965ED';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = 'C43F1866-5ADC-4DAC-8E31-DF5513046B8E';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = '13C5E3B9-FB24-4AE5-9340-02F6B211A464';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '4CFDC1D7-0B8F-43D5-9F8F-3C4E8B96ED37';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = 'DA33DD61-8DD7-4F24-BE94-64BE2B8E5B8D';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //29. สถานที่ทำงานปัจจุบัน
                    // 2. ชื่อของสถาบันการศึกษา / มหาวิทยาลัยที่ท่านต้องการศึกษา
                    answer = dr.FurtherStudyUniv;

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = '4CFDC1D7-0B8F-43D5-9F8F-3C4E8B96ED37';
                    this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y')
                    this.formatting.offeredAnswer.qtnanswersetID = '3DF1F1F5-33D4-40D9-B16B-38957C52F1E9';
                    this.formatting.offeredAnswer.qtnanswerID = '99541F6C-E182-4897-B878-531D5FAF903F';
                    this.formatting.offeredAnswer.answer = answer;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //30. เหตุผลที่ทำให้ท่านตัดสินใจศึกษาต่อ
                    switch (dr.FurtherStudyReason) {
                        case '1':
                        case '01':
                            qtnanswerID = '1BA96CAB-E112-4157-B704-C90ED393F2F6';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = 'F9238951-4180-4ABD-ABB2-E7562DE354D6';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = '81D84A6F-A57F-4CAA-A5AA-45B561617636';
                            break;
                        case '4':
                        case '04':
                            qtnanswerID = '6C0DB7B2-B00C-4C29-AB32-BB9AC8138C42';
                            break;
                        case '0':
                        case '00':
                            qtnanswerID = '21001D2A-FF63-4590-B273-7257BA60815A';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answerOther = [];

                    if (dr.OtherReason !== null)
                        answerOther.push({
                            value: dr.OtherReason
                        });

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = 'B307108F-63FF-4F3D-9034-02504D91717F';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = 'E896724A-D557-4FAA-89A3-0913BFD76AC6',
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //31. ท่านมีปัญหาในการศึกษาต่อหรือไม่
                    switch (dr.FurtherStudyProblem) {
                        case '1':
                        case '01':
                            qtnanswerID = '1962E10F-F13C-4857-86FC-7C31B9C75DD7';
                            break;
                        case '2':
                        case '02':
                        case '3':
                        case '03':
                        case '4':
                        case '04':
                        case '5':
                        case '05':
                        case '0':
                        case '00':
                            qtnanswerID = '42A76C26-ED98-4361-8F11-409AE555505D';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answer = this.doFilter('questionnaireAnswer', datasource.new.qtnanswers, 'ID', qtnanswerID);
                    answerOther = [];

                    if (answer !== null && answer.specify !== null && answer.specify.length > 0) {
                        if (answer.specify[0].items !== undefined) {                            
                            switch (dr.FurtherStudyProblem) {
                                case '2':
                                case '02':
                                    qtnanswerID = '42A76C26-ED98-4361-8F11-409AE555505D-01';
                                    break;
                                case '3':
                                case '03':
                                    qtnanswerID = '42A76C26-ED98-4361-8F11-409AE555505D-02';
                                    break;
                                case '4':
                                case '04':
                                    qtnanswerID = '42A76C26-ED98-4361-8F11-409AE555505D-03';
                                    break;
                                case '5':
                                case '05':
                                    qtnanswerID = '42A76C26-ED98-4361-8F11-409AE555505D-04';
                                    break;
                                case '0':
                                case '00':
                                    qtnanswerID = '42A76C26-ED98-4361-8F11-409AE555505D-00';
                                    break;
                                default:
                                    qtnanswerID = null;
                                    break
                            }

                            answerOther.push({
                                ID: answer.ID,
                                value: (qtnanswerID !== null ? [qtnanswerID] : qtnanswerID),
                                specify: dr.FurtherStudyProbOther
                            });
                        }

                        qtnanswerID = answer.ID;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '13C15528-8AE1-4776-ABE8-B194947CEF1D';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '7CD6C46B-BAD8-4CEC-BFFA-9D5EFFCAA144';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID,
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //32. ท่านมีปัญหาในการศึกษาต่อหรือไม่
                    answer = [];

                    ['englishskill', 'compskill', 'accountingskill', 'internetskill', 'practiceskill', 'researchskill', 'chineseskill', 'asianskill', 'otherskill'].forEach((skill) => {
                        qtnanswerID = null;
                        
                        switch (skill) {
                            case 'englishskill':
                                if (dr.EnglishSkill === '1')
                                    qtnanswerID = '7640B353-E5A7-44CF-9CFB-CED86BEF5E98';
                                break;
                            case 'compskill':
                                if (dr.CompSkill === '1')
                                    qtnanswerID = '1DEC26F6-3A92-408C-A110-A28E05F6D6A2';
                                break;
                            case 'accountingskill':
                                if (dr.AccountingSkill === '1')
                                    qtnanswerID = '8BF20719-AEBB-4460-AE29-7D1D5F1BA127';
                                break;
                            case 'internetskill':
                                if (dr.InternetSkill === '1')
                                    qtnanswerID = 'AA8B84FC-8D80-4A83-A479-B0870A0C16A1';
                                break;
                            case 'practiceskill':
                                if (dr.PracticeSkill === '1')
                                    qtnanswerID = '5F1261C3-FF2F-493E-8F6C-F64914BA66A0';
                                break;
                            case 'researchskill':
                                if (dr.ResearchSkill === '1')
                                    qtnanswerID = '68A6A2BB-375D-4C0C-BC43-488430E5E890';
                                break;
                            case 'chineseskill':
                                if (dr.ChineseSkill === '1')
                                    qtnanswerID = '704429DD-EB29-4FF2-BE12-5CAE4D31805B';
                                break;
                            case 'asianskill':
                                if (dr.AsianSkill === '1')
                                    qtnanswerID = '38DF926B-A954-4B79-817A-34DCE3607B15';
                                break;
                            case 'otherskill':
                                if (dr.OtherSkill === '1')
                                    qtnanswerID = 'F5381875-C89C-4EEA-9B1D-98EB661337F7';
                                break;
                            default:
                                qtnanswerID = null;
                                break;
                        }

                        if (qtnanswerID !== null)
                            answer.push(qtnanswerID);
                    });

                    answer = (answer.length > 0 ? answer : null);
                    answerOther = [];
                    
                    if (dr.SpecificOtherSkill !== null)
                        answerOther.push({
                            value: dr.SpecificOtherSkill
                        });

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '86F07BF5-594C-45ED-BB42-C9F3956A07DE';
                    this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '0F782058-9273-4E9F-A7D3-74CC2C9D03EB';
                    this.formatting.offeredAnswer.qtnanswerID = answer;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //33. ความเหมาะสมของหลักสูตรที่ท่านจบการศึกษาในการประกอบอาชีพ
                    ['groupcoursesrequired', 'coursegroupupdate', 'groupcoursesdonotteach', 'moregroupcourses', 'strengthcourse', 'weaknessescourse'].forEach((course) => {
                        qtnanswerID = null;

                        switch (course) {
                            case 'groupcoursesrequired':
                                qtnanswerID = 'F4D764A0-DF03-43BA-BE13-295AD1F5840D';
                                answer = dr.GroupCoursesRequired;
                                break;
                            case 'coursegroupupdate':
                                qtnanswerID = '2A7898E1-2C0E-40CE-9AEB-7F161447A3DB';
                                answer = dr.CourseGroupUpdate;
                                break;
                            case 'groupcoursesdonotteach':
                                qtnanswerID = '90213BF2-7F1E-4B1B-A3DC-52458C2C9416';
                                answer = dr.GroupCoursesDoNotTeach;
                                break;
                            case 'moregroupcourses':
                                qtnanswerID = '568DF500-4DD6-4A48-AE12-9F5C0DD4FB10';
                                answer = dr.MoreGroupCourses;
                                break;
                            case 'strengthcourse':
                                qtnanswerID = 'B340C172-B7C2-42B7-8FC3-D75CB176BCD7';
                                answer = dr.StrengthCourse;
                                break;
                            case 'weaknessescourse':
                                qtnanswerID = 'D0866BF0-F5A6-4DD4-AA2B-EA7F8ED70785';
                                answer = dr.WeaknessesCourse;
                                break;
                            default:
                                qtnanswerID = null;
                                answer = null;
                                break;
                        }

                        this.formatting.data = null;
                        this.formatting.offeredAnswer.qtnquestionID = '513A79C7-C4B5-4EAF-9575-75A90BE932DB';
                        this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y');
                        this.formatting.offeredAnswer.qtnanswersetID = '1CB48F6C-B70F-4521-9B4A-E752F2794AD2';
                        this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                        this.formatting.offeredAnswer.answer = answer;
                        this.formatting.offeredAnswer.answerOther = null;
                        offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    });

                    //34. ข้อเสนอแนะเกี่ยวกับหลักสูตรและสาขาวิชาที่เรียน
                    answer = dr.ProgramComment;

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = '77854DD5-2770-42A8-94A6-1E5975589507';
                    this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '530439CF-6AD1-446F-B69B-71D887258DFE';
                    this.formatting.offeredAnswer.qtnanswerID = '00C73F67-C5F3-4418-853D-613756A61687';
                    this.formatting.offeredAnswer.answer = answer;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //35. ข้อเสนอแนะเกี่ยวกับการเรียนการสอน
                    answer = dr.StudyingComment;

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = '552AE37C-90FF-4B18-B0CC-7DA944DD7665';
                    this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '89956446-ED1A-46AB-AFC2-99CBE07AD78B';
                    this.formatting.offeredAnswer.qtnanswerID = '91C50E29-4A74-4BF5-BB01-075FF13C88F1';
                    this.formatting.offeredAnswer.answer = answer;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //36. ข้อเสนอแนะเกี่ยวกับกิจกรรมพัฒนานักศึกษา
                    answer = dr.ActivityComment;

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = 'F2D9AE98-5F72-4294-BF53-50ED26243C97';
                    this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '9F7010EE-A2FF-438E-A6F5-0F45ED6B8357';
                    this.formatting.offeredAnswer.qtnanswerID = 'C4F38E90-7F84-4B78-97B5-E9A897EA3998';
                    this.formatting.offeredAnswer.answer = answer;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //37. ถ้ามีผู้ขอคำแนะนำในการเลือกสถาบันการศึกษาท่านจะแนะนำให้เรียนที่มหาวิทยาลัยมหิดล
                    switch (dr.SuggestMUsts) {
                        case '1':
                        case '01':
                            qtnanswerID = '02B43FEB-673B-4B56-9F31-D19F6BC30897';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = 'E9DAE66A-19F8-4D96-99ED-5EEB86C9AA0C';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = '8CC8F39E-F362-4B1C-9943-15D2F5FE2D2E';
                            break;
                        case '4':
                        case '04':
                            qtnanswerID = 'C80C9D19-ECB9-4C5F-9955-01618EDDB049';
                            break;
                        case '5':
                        case '05':
                            qtnanswerID = '5F30814D-CA1B-4934-ADED-CA6D93209B9A';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '90128514-FF80-4786-A021-19CB5CC7F298';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '7F201584-4CC9-409F-8652-C42F3B5138F3';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //38. สถานที่ที่ต้องการให้มหาวิทยาลัยมหิดล ส่งข่าวสาร
                    // 1. สถานที่
                    switch (dr.FlagAlumniAddr) {
                        case '1':
                        case '01':
                            qtnanswerID = 'BB0AE4E0-0A0A-41A8-B4BA-5AE9A317C9D2';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = '628F0CB1-8115-47BA-8174-7C0B2CAEDA49';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = '5B03C58F-AAC1-4A69-8065-358477EB55F9';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = 'FCF8A3BF-DF29-4983-AFDB-858DF59004AC';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '116E1B27-6907-4412-A98C-D14F1BF8475A';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    //38. สถานที่ที่ต้องการให้มหาวิทยาลัยมหิดล ส่งข่าวสาร
                    // 2. ที่อยู่
                    address = {};
                    
                    if (dr.AlumniAddr !== null && dr.AlumniAddr.length > 0)
                        address['adddressNo'] = dr.AlumniAddr;

                    if (dr.AlumniMhoo !== null && dr.AlumniMhoo.length > 0)
                        address['moo'] = dr.AlumniMhoo;

                    if (dr.AlumniBuilding !== null && dr.AlumniBuilding.length > 0)
                        address['building'] = dr.AlumniBuilding;

                    if (dr.AlumniFloor !== null && dr.AlumniFloor.length > 0)
                        address['floors'] = dr.AlumniFloor;

                    if (dr.AlumniSoi !== null && dr.AlumniSoi.length > 0)
                        address['soi'] = dr.AlumniSoi;

                    if (dr.AlumniRoad !== null && dr.AlumniRoad.length > 0)
                        address['road'] = dr.AlumniRoad;

                    answer = this.doFilter('country', datasource.new.countries, 'id', (dr.AlumniCountry !== null ? dr.AlumniCountry : '217'));
                    
                    if (answer !== null)
                        address['country'] = {
                            ID: answer.ID
                        };

                    if (dr.AlumniProvince !== null && dr.AlumniProvince.length > 0) {
                        answer = this.doFilter('province', datasource.new.provinces, 'id', dr.AlumniProvince);

                        if (answer !== null)
                            address['province'] = {
                                ID: answer.ID
                            };
                    }

                    if (dr.AlumniDistrict !== null && dr.AlumniDistrict.length > 0) {
                        answer = this.doFilter('district', datasource.new.districts, 'id', dr.AlumniDistrict);

                        if (answer !== null)
                            address['district'] = {
                                ID: answer.ID
                            };
                    }

                    if (dr.AlumniSubDist !== null && dr.AlumniSubDist.length > 0) {
                        answer = this.doFilter('subdistrict', datasource.new.subdistricts, 'id', dr.AlumniSubDist);

                        if (answer !== null) 
                            address['subdistrict'] = {
                                ID: answer.ID
                            };
                    } 

                    if (dr.AlumniZipcode !== null && dr.AlumniZipcode.length > 0)
                        address['zipcode'] = dr.AlumniZipcode;

                    if (dr.AlumniTelNum !== null && dr.AlumniTelNum.length > 0)
                        address['telephone'] = dr.AlumniTelNum;

                    if (dr.AlumniMobile !== null && dr.AlumniMobile.length > 0)
                        address['mobilePhone'] = dr.AlumniMobile;

                    if (dr.AlumniFax !== null && dr.AlumniFax.length > 0)
                        address['fax'] = dr.AlumniFax;

                    if (dr.AlumniEmail !== null && dr.AlumniEmail.length > 0)
                        address['email'] = dr.AlumniEmail;

                    answer = (Object.keys(address).length > 0 ? address : null);

                    this.formatting.data = null;
                    this.formatting.offeredAnswer.qtnquestionID = 'FCF8A3BF-DF29-4983-AFDB-858DF59004AC';
                    this.formatting.offeredAnswer.errorStatus = (answer !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = 'C2D86C0E-A744-4A49-AAE1-A1A20CBF756B';
                    this.formatting.offeredAnswer.qtnanswerID = 'E9D7F386-8661-46E0-8EC1-F6806C61C4CB';
                    this.formatting.offeredAnswer.answer = answer;
                    this.formatting.offeredAnswer.answerOther = null;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());

                    //39. กิจกรรมที่ท่านต้องการให้มหาวิทยาลัยจัดให้ศิษย์เก่า คือ
                    switch (dr.AlumniActivity) {
                        case '1':
                        case '01':
                            qtnanswerID = '675251CD-92A5-4BF4-B9CA-C3273BB6597E';
                            break;
                        case '2':
                        case '02':
                            qtnanswerID = '0FA4C45F-92DE-4424-B31B-F46239A5B732';
                            break;
                        case '3':
                        case '03':
                            qtnanswerID = '21E51228-4B66-44B8-9793-2496604AEB2E';
                            break;
                        case '4':
                        case '04':
                            qtnanswerID = 'DB5B573D-01CD-4D50-A0D5-3CCC27386FB2';
                            break;
                        case '5':
                        case '05':
                            qtnanswerID = '3425B152-F247-481A-8A83-8B2DF797CAF3';
                            break;
                        default:
                            qtnanswerID = null;
                            break;
                    }

                    answerOther = [];

                    if (dr.AlumniComment !== null)
                        answerOther.push({
                            value: dr.AlumniComment
                        });

                    this.formatting.data = datasource.new.qtnanswers;
                    this.formatting.offeredAnswer.qtnquestionID = '47BE8AD9-5BAE-49B0-B870-60E1549D5B54';
                    this.formatting.offeredAnswer.errorStatus = (qtnanswerID !== null ? 'N' : 'Y');
                    this.formatting.offeredAnswer.qtnanswersetID = '608CC0FB-4C71-4802-B2FA-5684A3D4CA47';
                    this.formatting.offeredAnswer.qtnanswerID = qtnanswerID;
                    this.formatting.offeredAnswer.answer = null;
                    this.formatting.offeredAnswer.answerOther = answerOther;
                    offeredAnswer.push(this.formatting.offeredAnswer.doSet());
                    
                    let offeredanswer2str = JSON.stringify(offeredAnswer);
                    let offeredanswersets = [null, null, null, null, null, null, null, null, null, null];
                    let start = 0;
                    let end = 0;
                    let i = 0;
        
                    while(end < offeredanswer2str.length) {
                        start = end;
                        end = end + 4000;
                        end = (end > offeredanswer2str.length ? offeredanswer2str.length : end);
        
                        offeredanswersets[i] = offeredanswer2str.substring(start, end);
        
                        i++;
                    }

                    setTimeout(async () => {
                        qtndone = {
                            ID: null,
                            empQuestionnaireSetID:  this.questionnaireSet.ID,
                            PPID: dr.studentCode,
                            perPersonID: dr.personId,
                            studentCode: dr.studentCode,
                            IDCard: dr.idCard,
                            titlePrefixTH: dr.titlePrefixTH,
                            titlePrefixEN: (dr.titlePrefixEN !== null ? dr.titlePrefixEN.toUpperCase() : null),
                            firstNameTH: dr.firstNameTH,
                            middleNameTH: dr.middleNameTH,
                            lastNameTH: dr.lastNameTH,
                            firstNameEN: (dr.firstNameEN !== null ? dr.firstNameEN.toUpperCase() : null),
                            middleNameEN: (dr.middleNameEN !== null ? dr.middleNameEN.toUpperCase() : null),
                            lastNameEN: (dr.lastNameEN !== null ? dr.lastNameEN.toUpperCase() : null),
                            instituteNameTH: dr.instituteNameTH,
                            instituteNameEN: (dr.instituteNameEN !== null ? dr.instituteNameEN.toUpperCase() : null),
                            facultyID: dr.facultyId,
                            facultyCode: dr.facultyCode,
                            facultyNameTH:  dr.facultyNameTh,
                            facultyNameEN: (dr.facultyNameEn !== null ? dr.facultyNameEn.toUpperCase() : null),
                            programID: dr.programId,
                            programCode: dr.programCode,
                            majorCode: dr.majorCode,
                            groupNum: dr.groupNum,
                            degreeLevelNameTH: dr.degreeLevelNameTH,
                            degreeLevelNameEN: (dr.degreeLevelNameEN !== null ? dr.degreeLevelNameEN.toUpperCase() : null),
                            programNameTH: dr.programNameTh,
                            programNameEN: (dr.programNameEn !== null ? dr.programNameEn.toUpperCase() : null),
                            degreeNameTH: dr.degreeNameTH,
                            degreeNameEN: (dr.degreeNameEN !== null ? dr.degreeNameEN.toUpperCase() : null),
                            branchID: dr.branchID,
                            branchNameTH: dr.branchNameTH,
                            branchNameEN: (dr.branchNameEN !== null ? dr.branchNameEN.toUpperCase() : null),
                            class: dr.classYear,
                            yearEntry: dr.yearEntry,
                            graduateYear: dr.graduateYear,
                            gender: dr.gender,
                            birthDate: dr.birthDate,
                            nationalityNameTH: dr.nationalityNameTH,
                            nationalityNameEN: (dr.nationalityNameEN !== null ? dr.nationalityNameEN.toUpperCase() : null),
                            nationality2Letter: dr.nationality2Letter,
                            nationality3Letter: dr.nationality3Letter,
                            raceNameTH: dr.raceNameTH,
                            raceNameEN: (dr.raceNameEN !== null ? dr.raceNameEN.toUpperCase() : null),
                            race2Letter: dr.race2Letter,
                            race3Letter: dr.race3Letter,
                            offeredAnswer01: offeredanswersets[0],
                            offeredAnswer02: offeredanswersets[1],
                            offeredAnswer03: offeredanswersets[2],
                            offeredAnswer04: offeredanswersets[3],
                            offeredAnswer05: offeredanswersets[4],
                            offeredAnswer06: offeredanswersets[5],
                            offeredAnswer07: offeredanswersets[6],
                            offeredAnswer08: offeredanswersets[7],
                            offeredAnswer09: offeredanswersets[8],
                            offeredAnswer10: offeredanswersets[9],
                            submitStatus: 'N',
                            cancelStatus: 'N',
                            actionDate: dr.createdDate,
                            actionBy: dr.createdBy
                        }
                        
                        let conn;
                        let connRequest;
                        let result;

                        try {
                            conn = await util.db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
                            connRequest = conn.request();

                            connRequest.input('method', sql.VarChar, 'POST');
                            connRequest.input('jsonData', sql.NVarChar, JSON.stringify(qtndone));
        
                            result = await util.db.doExecuteStoredProcedure(connRequest, 'sp_empSetQuestionnaireDone');
                            result.dataset = (result.dataset.length > 0 ? result.dataset[0] : []);
                            
                            if (result.dataset.length > 0) 
                                console.log(dr.no + '. ' + dr.studentCode + ' => ' + (result.dataset[0].errorCode === 0 ? 'Success' : 'Error'));
                            else
                                console.log(dr.no + '. ' + dr.studentCode + ' => ' + 'Error');
                        }
                        catch {
                        }

                        if ((index + 1) === datasource.old.dones.length) {
                            setTimeout(() => {
                                console.log('\nDone');
                                util.spinner.stop(cursorSpinner);
                            }, 100);
                        }
                        
                        conn.close();
                    }, index * 1000);
                });
                
                setTimeout(() => {
                    util.spinner.stop(cursorSpinner);
                }, 500);
            }
            else {
                setTimeout(() => {
                    console.log('Questionnaire ( new ) Not Found');
                    util.spinner.stop(cursorSpinner);
                }, 500);
            }
        }
        else {
            setTimeout(() => {
                util.spinner.stop(cursorSpinner);
            }, 500);
        }
    }
}

module.exports = new Questionnaire();