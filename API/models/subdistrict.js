/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๒/๑๑/๒๕๖๔>
Modify date : <๒๑/๑๒/๒๕๖๔>
Description : <>
=============================================
*/

'use strict';

const sql = require('mssql');
const util = require('../util');

class Schema {
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
}

async function doGetList() {
    let db = new util.DB();
    let conn;
    let connRequest;
    
    try {
        conn = await db.doGetConnectRequest(process.env.DB_DATABASE_INFINITY);
        connRequest = conn.request();
        connRequest.input('sortOrderBy', sql.VarChar, 'Full Name ( TH )');
    }
    catch {
    }
    
    let data = await db.doExecuteStoredProcedure(connRequest, 'sp_plcGetListSubdistrict');
    let ds = [];
    
    if (data.dataset.length > 0) {
        let schema = new Schema();

        data.dataset[0].forEach(dr => {
            ds.push(new schema.Subdistrict (
                dr.id,
                {
                    ID: dr.plcCountryId,
                    isoCountryCodes3Letter: dr.isoCountryCodes3Letter
                },
                {
                    ID: dr.plcProvinceId,
                    name: {
                        th: dr.provinceNameTH,
                        en: dr.provinceNameEN
                    }
                },
                {
                    ID: dr.plcDistrictId,
                    name: {
                        th: dr.districtNameTH,
                        en: dr.districtNameEN
                    },
                    zipCode: dr.zipCode
                },
                {
                    th: dr.subdistrictNameTH,
                    en: dr.subdistrictNameEN
                }
            ));
        });
    }
    
    data.dataset = ds;
    conn.close();

    return data;
}

module.exports = {
    Schema: Schema,
    doGetList: doGetList
};