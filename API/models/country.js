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
    
    let data = await db.doExecuteStoredProcedure(connRequest, 'sp_plcGetListCountry');
    let ds = [];
    
    if (data.dataset.length > 0) {
        let schema = new Schema();

        data.dataset[0].forEach(dr => {
            ds.push(new schema.Country (
                dr.id,
                {
                    th: dr.countryNameTH,
                    en: dr.countryNameEN
                },
                dr.isoCountryCodes2Letter,
                dr.isoCountryCodes3Letter
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