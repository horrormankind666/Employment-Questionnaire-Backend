/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๓/๐๙/๒๕๖๔>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import sql from 'mssql';

import util from '../util.js';

class MSent {
    async doSet(jsonData) {
        let conn;
        let connRequest;
        
        try {
            conn = await util.db.doGetConnectRequest(process.env.DB_DATABASE_SYSTEM);
            connRequest = conn.request();
            connRequest.input('jsonData', sql.NVarChar, jsonData);
        }
        catch {
        }

        let data = await util.db.doExecuteStoredProcedure(connRequest, 'sp_empSetQuestionnaireConsent');
        let ds = [];

        if (data.dataset.length > 0)
            ds = data.dataset[0];

        data.dataset = ds;
        util.db.doConnClose(conn);

        return data;
    }
}

export default new MSent;