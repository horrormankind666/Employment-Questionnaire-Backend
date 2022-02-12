/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๑/๐๒/๒๕๖๕>
Modify date : <๑๑/๐๒/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const sql = require('mssql');
const util = require('../util');

async function doGetList() {
    let db = new util.DB();
    let conn;
    let connRequest;
    
    try {
        conn = await db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
        connRequest = conn.request();
    }
    catch {
    }
    
    let query = 'select   a.pos_name as name ' +
                'from     ('+
                '           select	 ltrim(rtrim(pos_name)) as pos_name ' +
                '           from	 MUA_REF_POSITION_CAREER '+
                '           group by pos_name'+
                '         ) as a '+
                'order by a.pos_name';
    
    let data = await db.doExecuteQuery(connRequest, query);
    let ds = [];

    if (data.dataset.length > 0) {
        data.dataset[0].forEach(dr => {
            ds.push({
                name: dr.name
            });
        });
    }
    
    data.dataset = ds;
    conn.close();

    return data;
}

module.exports = {
    doGetList: doGetList
};