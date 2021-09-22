/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๐/๐๙/๒๕๖๔>
Modify date : <๑๔/๐๙/๒๕๖๔>
Description : <>
=============================================
*/

const atob = require('atob');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');

function getAPIMessage(statusCode, data, message) {
    return {
        statusCode: statusCode,
        data: data,
        message: (message ? message : (statusCode === 200 ? 'OK' : ''))
    };
}

class DB {
    config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        server: process.env.DB_SERVER,
        pool: {
            idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT)
        },
        options: {
            encrypt: true,
            trustServerCertificate: true
        } 
    }

    async getConnectRequest() {
        try {
            let conn = await sql.connect(this.config);

            return conn.request();
        }
        catch { }
    }

    async executeStoredProcedure(spName, request) {
        try {
            let ds = await request.execute(spName);

            return {
                data: ds.recordsets,
                message: 'OK'
            };
        } catch (error) {
            return {
                data: [],
                message: 'Database Connection Fail'
            };
        }
    }
}

class Authorization {
    ADFS = {
        parserCUID(str) {
            try {
                /*
                let strDecode = atob(str);
                let strDecodeSplit = strDecode.split('.');
                let data = strDecodeSplit[2];
                let dataReverse = data.split('').reverse().join('');
                let dataReverseDecode = atob(dataReverse);
                let dataReverseDecodeSplit = dataReverseDecode.split('.');
        
                return ({
                    PPID: dataReverseDecodeSplit[0]
                });
                */

                return ({
                    PPID: '6unbq648oglyxf90ds',
                    perPersonID: null,
                    studentCode: null
                });
            }
            catch {
                return null;
            }
        },
        parserToken(str) {
            try {
                /*
                let strDecode = atob(str);
                let strDecodeSplit = strDecode.split('.');
                let CUIDInfo = this.parserCUID(atob(strDecodeSplit[0]).split('').reverse().join(''));                
                let tokenParse = CUIDInfo;

                tokenParse.token = atob(strDecodeSplit[1]).split('').reverse().join('');
                */

                let CUIDInfo = this.parserCUID(str);
                let tokenParse = CUIDInfo;

                tokenParse.token = str;

                return tokenParse;
            }
            catch {
                return null;
            }
        },
        getInfo(request) {
            let authorization = request.headers.authorization;
            let statusCode = 200;
            let isAuthenticated = false;
            let payload = {};
            let message = '';
            
            if (authorization) {
                if (authorization.startsWith("Bearer ")) {
                    let bearerToken = authorization.substring("Bearer ".length).trim();
                    let bearerTokenInfo = this.parserToken(bearerToken);
                    let publickey = fs.readFileSync(__dirname + '/public.key');

                    try {
                        payload = jwt.verify(bearerTokenInfo.token, publickey, { algorithms: ['RS256'] });

                        if (bearerTokenInfo.PPID === payload.ppid) {
                            statusCode = 200;
                            isAuthenticated = true;
                            payload.perPersonID = bearerTokenInfo.perPersonID;
                            payload.studentCode = bearerTokenInfo.studentCode;
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
    getAPIMessage: getAPIMessage,
    DB: DB,
    Authorization: Authorization
};