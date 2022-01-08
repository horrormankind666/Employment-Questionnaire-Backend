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
    
    let data = await db.doExecuteStoredProcedure(connRequest, 'sp_plcGetListDistrict');
    let ds = [];
    
    if (data.dataset.length > 0) {
        let schema = new Schema();

        data.dataset[0].forEach(dr => {
            ds.push(new schema.District (
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
                    th: dr.districtNameTH,
                    en: dr.districtNameEN
                },
                dr.zipCode
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