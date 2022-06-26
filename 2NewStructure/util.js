/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๒/๐๓/๒๕๖๕>
Modify date : <๑๘/๐๓/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const sql = require('mssql');
const process = require('process');
const readline = require('readline');

const std = process.stdout;

require('dotenv').config();

class DB {
    bermuda = { 
        config: {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'Bermuda',
            server: process.env.DB_SERVER,
            pool: {
                idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT)
            },
            options: {
                encrypt: true,
                trustServerCertificate: true
            } 
        }
    };

    infinity = {
        config: {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'Infinity',
            server: process.env.DB_SERVER,
            pool: {
                idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT)
            },
            options: {
                encrypt: true,
                trustServerCertificate: true
            } 
        }
    };

    async doGetConnectRequest(database) {
        let conn = null;

        try {
            if (database === process.env.DB_DATABASE_INFINITY)
                conn = await sql.connect(this.infinity.config);
            
            if (database === process.env.DB_DATABASE_BERMUDA)
                conn = await sql.connect(this.bermuda.config);
        }
        catch {
        }

        return conn;
    }

    async doExecuteStoredProcedure(
        connRequest,
        spName
    ) {
        try {
            let ds = await connRequest.execute(spName);

            return {
                dataset: ds.recordsets,
                message: 'OK'
            };
        } catch (error) {
            return {
                dataset: [],
                message: 'Database Connection Fail'
            };
        }
    }

    async doExecuteQuery(
        connRequest,
        query
    ) {
        try {
            let ds = await connRequest.query(query);

            return {
                dataset: ds.recordsets,
                message: 'OK'
            };
        } catch (error) {
            return {
                dataset: [],
                message: 'Database Connection Fail'
            };
        }
    }

    doConnClose(conn) {
        if (conn !== null)
            conn.close();
    }
}

class Spinner {
    styles = {
        line: {
            timeInterval: 130,
            frames: ['-', '\\', '|', '/']
        }
    };

    style = null;

    start() {
        if (this.style === null)
            this.style = this.styles.line;

        const spinner = this.style;

        let index = 0;
        let char = '';

        return setInterval(() => {
            index = (char === undefined ? 0 : index);
            char = spinner.frames[index];
            
            std.write(char);
            readline.cursorTo(std, 0);
            index = ((index + 1) === spinner.frames.length ? 0 : (index + 1));
        }, spinner.timeInterval);
    }

    stop(spin) {
        if (spin !== null)
            clearInterval(spin);
    }
}

class Util {
    constructor() {
        this.db = new DB();
        this.spinner = new Spinner();
    }
}

module.exports = new Util();