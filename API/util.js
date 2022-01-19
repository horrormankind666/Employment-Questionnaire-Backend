/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๐/๐๙/๒๕๖๔>
Modify date : <๑๐/๐๑/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

const atob = require('atob');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');

function doGetAPIMessage(
    statusCode,
    data,
    message
) {
    return {
        statusCode: statusCode,
        data: data,
        message: (message ? message : (statusCode === 200 ? 'OK' : ''))
    };
}

function doParseCUID(str) {
    try {
        let strDecode = atob(str);
        let strDecodes = strDecode.split('.');
        let data = strDecodes[2];
        let dataReverse = data.split('').reverse().join('');
        let dataReverseDecode = atob(dataReverse);
        let dataReverseDecodes = dataReverseDecode.split('.');

        return dataReverseDecodes;
    }
    catch {
        return null;
    }
}

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
        try {
            let conn = null;

            if (database === process.env.DB_DATABASE_INFINITY)
                conn = await sql.connect(this.infinity.config);
            
            if (database === process.env.DB_DATABASE_BERMUDA)
                conn = await sql.connect(this.bermuda.config);
                        
            return conn;
        }
        catch {
        }
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
            console.log(error);

            return {
                dataset: [],
                message: 'Database Connection Fail'
            };
        }
    }
}

class Authorization {
    ADFS = {
        doParseToken(str) {
            try {
                let strDecode = atob(str);
                let strDecodes = strDecode.split('.');
    
                return ({
                    CUID: atob(strDecodes[0]).split('').reverse().join(''),
                    token: atob(strDecodes[1]).split('').reverse().join('')
                });
            }
            catch {
                return null;
            }
        },
        doGetInfo(request) {
            let authorization = request.headers.authorization;
            let statusCode = 200;
            let isAuthenticated = false;
            let payload = {};
            let message = '';
            
            if (authorization) {
                if (authorization.startsWith("Bearer ")) {
                    try {
                        let bearerToken = authorization.substring("Bearer ".length).trim();
                        let bearerTokenInfo = this.doParseToken(bearerToken);
                        let CUIDInfos = doParseCUID(bearerTokenInfo.CUID);
                        let PPID = (CUIDInfos !== null ? CUIDInfos[0] : null);
                        let publickey = fs.readFileSync(__dirname + '/public.key');

                        payload = jwt.verify(bearerTokenInfo.token, publickey, { algorithms: ['RS256'] });

                        if (PPID !== null && payload !== null && PPID === payload.ppid) {
                            statusCode = 200;
                            isAuthenticated = true;
                            message = 'OK';
                        }
                        else {
                            statusCode = 404;
                            isAuthenticated = false;
                            message = 'Not Found';
                        }
                    }
                    catch(error) {
                        statusCode = 401;
                        isAuthenticated = false;
    
                        if (error.name === 'TokenExpiredError')
                            message = 'Token Expired';
                        else
                            message = 'Token Invalid';
                    }
                }
                else {
                    statusCode = 401;
                    isAuthenticated = false;
                    message = 'Unauthorized';
                }
            }
            else {
                statusCode = 401;
                isAuthenticated = false;
                message = 'Unauthorized';
            }
            
            return {
                statusCode: statusCode,
                isAuthenticated: isAuthenticated,
                payload: payload,
                message: message
            };
        }
    };
}

module.exports = {
    doGetAPIMessage: doGetAPIMessage,
    doParseCUID: doParseCUID,
    DB: DB,
    Authorization: Authorization
};