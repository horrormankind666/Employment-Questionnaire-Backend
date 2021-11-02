/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๗/๑๐/๒๕๖๔>
Modify date : <๐๒/๑๑/๒๕๖๔>
Description : <>
=============================================
*/

'use strict';

const sql = require('mssql');
const util = require('../util');

class Schema {
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
    }
}

async function getList() {
    let db = new util.DB();
    let conn;
    let connRequest;
    
    try {
        conn = await db.getConnectRequest(process.env.DB_DATABASE_INFINITY);
        connRequest = conn.request();
        connRequest.input('sortOrderBy', sql.VarChar, 'Full Name ( TH )');
    }
    catch { }
    
    let data = await db.executeStoredProcedure(connRequest, 'sp_plcGetListProvince');
    let ds = [];
    
    if (data.dataset.length > 0) {
        let schema = new Schema();

        data.dataset[0].forEach(dr => {
            ds.push(new schema.Province (
                dr.id,
                {
                    ID: dr.plcCountryId,
                    isoCountryCodes3Letter: dr.isoCountryCodes3Letter
                },
                {
                    th: dr.provinceNameTH,
                    en: dr.provinceNameEN
                },
                dr.regionalName
            ));
        });
    }
    
    data.dataset = ds;
    conn.close();

    return data;
}

module.exports = {
    Schema: Schema,
    getList: getList
};