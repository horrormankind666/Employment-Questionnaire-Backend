/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๗/๑๐/๒๕๖๔>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import sql from 'mssql';

import util from '../util.js';

import schema from './schema.js';

class Province {
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
        
        let data = await util.db.doExecuteStoredProcedure(connRequest, 'sp_plcGetListProvince');
        let ds = [];
        
        if (data.dataset.length > 0) {
            data.dataset[0].forEach((dr) => {
                ds.push(new schema.Province(
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
        util.db.doConnClose(conn);

        return data;
    }
}

export default new Province();