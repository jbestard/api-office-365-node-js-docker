import * as jwt from "jsonwebtoken";
import config from "../config";
import Subcription from "../database/entities/subcription.entities";
import User from "../database/entities/user.entities";
import Queries from "../database/queries";
import api from "../services/api";
import log from "../services/logger";
import AuthController from "./authController";

const create = ( token: string, expirationHours: number ) => {
    log.info("invoke - Create Subscription");
    return new Promise((resolve, reject) => {
        AuthController.valideToken(token).then( (infoToken: any) => {

            let now = new Date();
            let dateExp = new Date( now.setHours( now.getHours() + expirationHours ) );
            let data: any = {
                "@odata.type": "#Microsoft.OutlookServices.PushSubscription",
                "Resource": config.urls.ResourceSubscriptions,
                "NotificationURL": config.urls.NotificationURL,
                "ChangeType": "Created",
                "ClientState": infoToken.user.oid,
                "SubscriptionExpirationDateTime": dateExp
            };

            let headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + infoToken.accessToken
            };

            api.post(config.urls.subscriptions, headers, data).then( ( response: any) => {
                log.info("success invoke - Create Subscription");

                Queries.getSubcriptionById( response.Id, infoToken.user.oid ).then((result: any) => {
                    let newSubcription: Subcription = null;

                    if ( result ) {
                        newSubcription = result;
                    } else {
                        newSubcription = new Subcription();
                        newSubcription.user = infoToken.user;
                    }

                    newSubcription.SubId = response.Id;
                    newSubcription.resourceId = response.Id;
                    newSubcription.expiration = String( (new Date(response.SubscriptionExpirationDateTime)).getTime());
                    newSubcription.resourceUrl = response.Resource;

                    Queries.saveSubcription( newSubcription );
                    return resolve(response);

                }).catch( (err: any) => {
                    log.error("error invoke - Create Subscription - getSubcriptionById");
                    return reject(false);
                });
            } ).catch((error: any) => {
                log.error("error invoke - Create Subscription");
                return reject(error);
            });
        }).catch( (err: any) => {
            log.error("error invoke - Create Subscription - valideToken");
            return reject(err);
        } );
    });
};

const renew = ( tokenReal: string, subcriptionId: string, dateExp: any ) => {
    log.info("invoke - Renew Subscription");
    return new Promise((resolve, reject) => {
        let data: any = {
            "@odata.type": "#Microsoft.OutlookServices.PushSubscription",
            "SubscriptionExpirationDateTime": dateExp
        };

        let headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + tokenReal
        };

        api.patch(config.urls.subscriptions + "/" + subcriptionId, headers, data).then( ( response: any) => {
            log.info("success invoke - Renew Subscription");
            return resolve(response);
        } ).catch((error: any) => {
            log.error("error invoke - Renew Subscription");
            return reject(error);
        });
    });
};

const renewAll = ( token: string, expirationHours: number ) => {
    log.info("invoke - Renew Subscription");
    return new Promise((resolve, reject) => {
        AuthController.valideToken(token).then( (infoToken: any) => {
            let now = new Date();
            let dateExp = new Date( now.setHours( now.getHours() + expirationHours ) );

            const awaitRenew = ( subcription: Subcription ) => {
                return new Promise((resolveTmp, rejectTmp) => {
                    renew( infoToken.accessToken, subcription.SubId, dateExp ).then( (response: any) => {
                        subcription.expiration = String( (new Date(response.SubscriptionExpirationDateTime)).getTime());
                        Queries.saveSubcription( subcription );
                        resolveTmp({
                            error: null
                        });
                    }).catch( (err: any) => {
                        let msg = "Bad Request";
                        if ( err && err.response && err.response.data && err.response.data.error && err.response.data.error.message ) {
                            msg = err.response.data.error.message;
                        }

                        resolveTmp({
                            error: true,
                            message: msg
                        });
                    });
                });
            };

            Queries.getSubcriptionByUser( infoToken.user.oid ).then(async (results: any) => {
                let sol: any = {
                    stoppedChannels: 0,
                    startedChannels: 0,
                    errors: []
                };

                for ( let subcription of results ) {
                    sol.stoppedChannels += 1;
                    let res: any = await awaitRenew( subcription );

                    if ( !res.error ) {
                        sol.startedChannels += 1;
                    } else {
                        sol.errors.push( res.message );
                    }
                }

                resolve(sol);
            }).catch((error: any) => {
                log.error("error invoke - renewAll - getSubcriptionByUser", error);
                return reject(error);
            });
        }).catch( (err: any) => {
            log.error("error invoke - RemoveAll Subscription - valideToken");
            return reject(err);
        } );
    });
};

const remove = ( subcriptionId: string, tokenReal: string ) => {
    log.info("invoke - Remove Subscription");
    return new Promise((resolve, reject) => {
        let headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + tokenReal
        };

        api.deleteRequest(config.urls.subscriptions + "('" + subcriptionId + "')", headers, {}).then( ( response: any) => {
            log.info("success invoke - Remove Subscription");
            return resolve(response);
        } ).catch((error: any) => {
            log.error("error invoke - Remove Subscription");
            return reject(error);
        });
    });
};

const removeAll = ( token: string ) => {
    log.info("invoke - RemoveAll Subscription");
    return new Promise((resolve, reject) => {
        AuthController.valideToken(token).then( (infoToken: any) => {

            Queries.getSubcriptionByUser( infoToken.user.oid ).then((results: any) => {
                let listPromise = [];
                for ( let item of results ) {
                    let subcriptionId = item.SubId;
                    listPromise.push( remove( subcriptionId, infoToken.accessToken ) );
                    listPromise.push( Queries.deleteSubcription( item ) );
                }

                Promise.all( listPromise ).then( (val: any) => {
                    resolve(true);
                } ).catch( (e: any) => {
                    reject(false);
                });

            }).catch((error: any) => {
                log.error("error invoke - RemoveAll - getSubcriptionByUser", error);
                return reject(error);
            });
        }).catch( (err: any) => {
            log.error("error invoke - RemoveAll Subscription - valideToken");
            return reject(err);
        } );
    });
};

export default {
    create,
    renew,
    renewAll,
    remove,
    removeAll
};
