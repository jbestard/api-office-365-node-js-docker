import { Base64 } from "js-base64";
import * as jwt from "jsonwebtoken";
import qs from "querystring";
import config from "../config";
import User from "../database/entities/user.entities";
import Queries from "../database/queries";
import api from "../services/api";
import log from "../services/logger";
import EventsController from "./eventsController";
import SubscriptionsController from "./subscriptionsController";

const generateAuthUrl = (  ) => {
    log.info("invoke - generateAuthUrl");
    let urlService = config.urls.authorize;

    urlService += "?client_id=" + config.client_id;
    urlService += "&redirect_uri=" + config.redirect_uri;
    urlService += "&response_type=code";
    urlService += "&response_mode=query";
    urlService += "&scope=" + config.scope1.join(" ");
    urlService += "&state=12345";

    return urlService;
};

const valideToken = ( token: string ) => {
    return new Promise((resolve, reject) => {
        let tmp = Base64.decode( token ).split("2020IRIS365");
        if ( tmp.length !== 2 ) {
            log.error("error invoke - valideToken: Token invalido");
            return reject({
                error: "BAD_REQUEST"
            });
        }

        let accessTokenOri = tmp[0];
        let infoUser: any = null;

        try {
            infoUser = jwt.decode(tmp[1]);
            if ( !infoUser.oid ) {
                log.error("error invoke - valideToken: Token invalido, OID:null");
                return reject({
                    error: "NO_ID_PROVIDED"
                });
            }
          } catch (error) {
            log.error("error invoke - valideToken: Token invalido, jwt: Bad decode");
            return reject({
                error: "BAD_REQUEST"
            });
          }

        Queries.getUserByOid( infoUser.oid ).then( (user: User) => {
            if ( !user ) {
                log.error("error invoke - valideToken: Token invalido, user:not found");
                return reject({
                    error: "BAD_REQUEST"
                });
            }

            if ( user.token !== token ) {
            return reject({
                error: "BAD_REQUEST"
            });
            } else {
                resolve({
                    accessToken: accessTokenOri,
                    user
                });
            }

        }).catch((error: any) => {
            log.error("error invoke - valideToken");
            return reject({
                error: "BAD_REQUEST"
            });
        });
    });
};

const getToken = ( code: string ) => {
    log.info("invoke - getToken");
    log.info("code", code);
    return new Promise((resolve, reject) => {
        let headers = {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8"
        };

        let data = {
            client_id: config.client_id,
            scope: config.scope2.join(" "),
            redirect_uri: config.redirect_uri,
            client_secret: config.client_secret,
            grant_type: "authorization_code",
            code
        };

        api.post(config.urls.token, headers, qs.stringify(data)).then( ( response: any) => {
            log.info("success invoke - getToken");

            let infoUser: any = jwt.decode(response.id_token);

            Queries.getUserByOid( infoUser.oid ).then( (users: any) => {
                let responseMod: any = response;
                responseMod.access_token = Base64.encode( response.access_token + "2020IRIS365" + response.id_token );
                responseMod.refresh_token = Base64.encode( response.refresh_token + "2020IRIS365" + response.id_token );

                let userNew: User = null;

                if ( !users ) {
                    userNew = {
                        oid: infoUser.oid,
                        token: responseMod.access_token,
                        email: infoUser.preferred_username,
                        timeMin: null,
                        events: [],
                        subcriptions: []
                    };
                } else {
                    userNew = users;
                    userNew.token = responseMod.access_token;
                }

                Queries.saveUser(userNew);

                return resolve(responseMod);

            } ).catch( (err) => {
                log.error("error invoke - getToken - getUserByOid");
                return reject(false);
            });
        } ).catch((error: any) => {
            log.error("error invoke - getToken");
            return reject(error);
        });
    });
};

const getRefreshToken = ( refreshToken: string ) => {
    log.info("invoke - getRefreshToken");
    log.info("refreshToken", refreshToken);
    return new Promise((resolve, reject) => {
        let tmp = Base64.decode( refreshToken ).split("2020IRIS365");

        if ( tmp.length !== 2 ) {
            log.error("error invoke - getRefreshToken: Token invalido");
            return reject(false);
        }

        let refreshTokenOri = tmp[0];
        let idTokenOri = tmp[1];

        let infoUser: any = null;

        try {
            infoUser = jwt.decode(idTokenOri);
            if ( !infoUser.oid ) {
                log.error("error invoke - RemoveAll: Token invalido, OID:null");
                return reject({
                    error: "NO_ID_PROVIDED"
                });
            }
          } catch (error) {
            log.error("error invoke - RemoveAll: Token invalido, jwt: Bad decode");
            return reject({
                error: "BAD_REQUEST"
            });
          }

        Queries.getUserByOid( infoUser.oid ).then( (users: any) => {
            if ( !users ) {
                log.error("error invoke - RemoveAll: Token invalido, user:not found");
                return reject({
                    error: "BAD_REQUEST"
                });
            }

            let headers = {
                "content-type": "application/x-www-form-urlencoded;charset=utf-8"
            };

            let data = {
                client_id: config.client_id,
                scope: config.scope2.join(" "),
                redirect_uri: config.redirect_uri,
                client_secret: config.client_secret,
                grant_type: "refresh_token",
                refresh_token: refreshTokenOri
            };

            api.post(config.urls.token, headers, qs.stringify(data)).then( ( response: any) => {
                log.info("success invoke - getRefreshToken");
                let responseMod: any = response;
                responseMod.access_token = Base64.encode( response.access_token + "2020IRIS365" + idTokenOri );
                users.token = responseMod.access_token;
                Queries.saveUser(users);
                return resolve(responseMod);
            } ).catch((error: any) => {
                log.error("error invoke - getRefreshToken");
                return reject(error);
            });
        }).catch((error: any) => {
            log.error("error invoke - getRefreshToken - getUserByOid");
            return reject(error);
        });
    });
};

const cancelSync = ( token: string ) => {
    return new Promise((resolve, reject) => {
        valideToken(token).then( ( infoToken: any ) => {
            SubscriptionsController.removeAll( token ).then( (res: any) => {
                EventsController.removeAll(token).then( (res1: any) => {
                    Queries.deleteUser(infoToken.user).then( (res2: any) => {
                        resolve(res2);
                    }).catch( (err3: any) => {
                        reject(err3);
                    });
                }).catch( (err1: any) => {
                    reject(err1);
                });
            }).catch( (err: any) => {
                reject(err);
            });
        }).catch( (err2: any) => {
            reject(err2);
        });
    });
};

export default {
    generateAuthUrl,
    getToken,
    getRefreshToken,
    cancelSync,
    valideToken
};
