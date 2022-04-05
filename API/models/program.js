/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๑/๐๒/๒๕๖๕>
Modify date : <๑๘/๐๒/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const util = require('../util');

class Program {
    async doGetList() {
        let conn;
        let connRequest;
        
        try {
            conn = await util.db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
            connRequest = conn.request();
        }
        catch {
        }
        
        let query = 'select   program_name as name ' +
                    'from     MUA_REF_PROGRAM ' +
                    'where    (CANCELSTATUS is null) ' +
                    'order by program_name';
        
        let data = await util.db.doExecuteQuery(connRequest, query);
        let ds = [];

        if (data.dataset.length > 0) {
            data.dataset[0].forEach(dr => {
                ds.push({
                    name: dr.name
                });
            });
        }
        
        data.dataset = ds;
        util.db.doConnClose(conn);

        return data;
    }
}

module.exports = new Program();