/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๑/๐๒/๒๕๖๕>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import util from '../util.js';

class Career {
    async doGetList() {
        let conn;
        let connRequest;
        
        try {
            conn = await util.db.doGetConnectRequest(process.env.DB_DATABASE_BERMUDA);
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
        
        let data = await util.db.doExecuteQuery(connRequest, query);
        let ds = [];

        if (data.dataset.length > 0) {
            data.dataset[0].forEach((dr) => {
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

export default new Career();