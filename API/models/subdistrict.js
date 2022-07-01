/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๒/๑๑/๒๕๖๔>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import sql from 'mssql';

import util from '../util.js';
import schema from './schema.js';

class Subdistrict {
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
        
        let data = await util.db.doExecuteStoredProcedure(connRequest, 'sp_plcGetListSubdistrict');
        let ds = [];
        
        if (data.dataset.length > 0) {
            data.dataset[0].forEach((dr) => {
                ds.push(new schema.Subdistrict(
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
        util.db.doConnClose(conn);

        return data;
    }
}

export default new Subdistrict();