/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๐/๐๙/๒๕๖๔>
Modify date : <๓๐/๐๖/๒๕๖๕>
Description : <>
=============================================
*/

'use strict';

import atob from 'atob';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import sql from 'mssql';
import dotenv from 'dotenv';

const __dirname = path.resolve();

dotenv.config();

class DB {
    dev = {
        config: {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE_DB4DEV,
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
    bermuda = {
        config: {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE_BERMUDA,
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
            database: process.env.DB_DATABASE_INFINITY,
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
            if (database === process.env.DB_DATABASE_DB4DEV)
                conn = sql.connect(this.dev.config);

            if (database === process.env.DB_DATABASE_BERMUDA)
                conn = await sql.connect(this.bermuda.config);
                
            if (database === process.env.DB_DATABASE_INFINITY)
                conn = await sql.connect(this.infinity.config);
        
            return conn;
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
            console.log(error);

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
            console.log(error);

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

class Authorization {
    ADFS = {
        doParseToken(str) {
            try {
                let strDecode = atob(str);
                let strDecodes = strDecode.split('.');
    
                return ({
                    CUID: atob(strDecodes[0]).split('').reverse().join(''),
                    token: atob(strDecodes[1]).split('').reverse().join(''),
                    tokenExpiration: parseFloat(atob(strDecodes[2]).split('').reverse().join(''))
                });
            }
            catch {
                return null;
            }
        },
        doGetInfo(req) {
            let util = new Util();
            let authorization = req.headers.authorization;
            let statusCode = 200;
            let isAuthenticated = false;
            let payload = {};
            let message = '';
            
            if (authorization) {
                if (authorization.startsWith("Bearer ")) {
                    let bearerToken = authorization.substring("Bearer ".length).trim();
                    let bearerTokenInfo = this.doParseToken(bearerToken);
                    let CUIDInfos = util.doParseCUID(bearerTokenInfo.CUID);
                    let PPID = (CUIDInfos !== null ? CUIDInfos[0] : null);
                    let isValid = true;

                    try {
                        let publickey = fs.readFileSync(__dirname + '/public.key');

                        payload = jwt.verify(bearerTokenInfo.token, publickey, { algorithms: ['RS256'] });
                    }
                    catch(error) {
                        if (error.name === 'TokenExpiredError')
                            payload = jwt.decode(bearerTokenInfo.token);
                        else
                            isValid = false;
                    }

                    if (isValid === true) {
                        if (this.doIsTokenExpired(bearerTokenInfo.tokenExpiration) === false) {
                            if (PPID !== null && payload !== null && PPID === payload.ppid) {
                                statusCode = 200;
                                isAuthenticated = true;
                                message = 'OK';
                            }
                            else {
                                statusCode = 404;
                                isAuthenticated = false;
                                message = 'User Not Found';
                            }
                        }
                        else {
                            statusCode = 401;
                            isAuthenticated = false;
                            message = 'Token Expired';
                        }
                    }
                    else {
                        statusCode = 401;
                        isAuthenticated = false;
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
        },
        doIsTokenExpired(tokenExpiration) {
            if (tokenExpiration !== null) {
                if (tokenExpiration < (Date.now() / 1000))
                    return true;
    
                return false;
            }
    
            return true;
        }
    }
}

class Util {
    constructor() {
        this.db = new DB();
        this.authorization = new Authorization();
    }

    doGetAPIMessage(
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

    doParseCUID(str) {
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
}

export default new Util();