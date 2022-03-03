/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๒/๑๑/๒๕๖๔>
Modify date : <๐๓/๐๓/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const sql = require('mssql');
const util = require('../util');
const schema = require('./schema');

class District {
    async doGetList() {
        let conn;
        let connRequest;
        
        try {
            conn = await util.db.doGetConnectRequest(process.env.DB_DATABASE_INFINITY);
            connRequest = conn.request();
            connRequest.input('sortOrderBy', sql.VarChar, 'Full Name ( TH )');
        }
        catch {
        }
        
        let data = await util.db.doExecuteStoredProcedure(connRequest, 'sp_plcGetListDistrict');
        let ds = [];
        
        if (data.dataset.length > 0) {
            data.dataset[0].forEach(dr => {
                ds.push(new schema.District(
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
}

module.exports = new District();