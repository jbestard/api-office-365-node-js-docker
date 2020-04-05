
import { emit } from "cluster";
import { Base64 } from "js-base64";
import * as jwt from "jsonwebtoken";
import config from "../config";
import Event from "../database/entities/event.entities";
import User from "../database/entities/user.entities";
import Queries from "../database/queries";
import api from "../services/api";
import log from "../services/logger";
import AuthController from "./authController";

const listEvents = ( token: string, MAXRESULTS: number, TIMEMIN: string, TIMEMAX: string, SINGLEEVENTS: boolean, NEXTPAGETOKEN: number, NEXTSYNCTOKEN: string ) => {
    log.info("invoke - listEvents");
    // log.info("code", code);
    return new Promise((resolve, reject) => {
        AuthController.valideToken( token ).then( (infoToken: any) => {
            let data: any = {
                $select: "Subject,ResponseStatus,WebLink,CreatedDateTime,LastModifiedDateTime,BodyPreview,Organizer,IsOrganizer,Start,End,iCalUID,Attendees,IsReminderOn,ReminderMinutesBeforeStart,Instances",
                startDateTime: TIMEMIN,
                endDateTime: TIMEMAX
            };

            if ( MAXRESULTS ) {
                data.$top = MAXRESULTS;
            }

            if ( NEXTPAGETOKEN ) {
                data.$skip = NEXTPAGETOKEN;
            }

            let headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + infoToken.accessToken
            };

            let lastSync = ( NEXTSYNCTOKEN ) ? new Date(parseInt(Base64.decode(NEXTSYNCTOKEN), 10)) : null;

            api.get(config.urls.calendarview, headers, data).then( ( response: any) => {
                for ( let item of response.value ) {
                    let update = new Date(item.LastModifiedDateTime);

                    if ( lastSync && update < lastSync ) {
                        continue;
                    }

                    Queries.getEventById( item.Id, infoToken.user.oid ).then((result: any) => {
                        let newEvent: Event = null;
                        if ( result ) {
                            newEvent = result;
                        } else {
                            newEvent = new Event();
                        }

                        newEvent.user = infoToken.user;
                        newEvent.eatg = item["@odata.etag"];
                        newEvent.eventId = item.Id;
                        newEvent.status = item.ResponseStatus.Response;
                        newEvent.htmlLink = item.WebLink;
                        newEvent.created = String( new Date(item.CreatedDateTime).getTime() );
                        newEvent.updated = String( new Date(item.LastModifiedDateTime).getTime() );
                        newEvent.summary = item.Subject;
                        newEvent.creatorEmail = item.Organizer.EmailAddress.Address;
                        newEvent.creatorSelf = item.IsOrganizer;
                        newEvent.organizerEmail = item.Organizer.EmailAddress.Address;
                        newEvent.organizerSelf = item.IsOrganizer;
                        newEvent.startDateTime = String( new Date(item.Start.DateTime).getTime() );
                        newEvent.startTimeZone = item.Start.TimeZone;
                        newEvent.endDateTime = String( new Date(item.End.DateTime).getTime() );
                        newEvent.endTimeZone = item.End.TimeZone;
                        newEvent.icaluid = item.iCalUId;
                        newEvent.isReminderOn = item.IsReminderOn;
                        newEvent.reminderMinutesBeforeStart = item.ReminderMinutesBeforeStart;

                    Queries.insertEvent( newEvent );
                    }).catch( (err: any) => {
                        log.error("error invoke - listEvents - getEventById");
                        return reject(false);
                    } );
                }

                if ( !infoToken.user.timeMin ) {
                    infoToken.user.timeMin = String(new Date().getTime());
                    Queries.saveUser( infoToken.user );
                }

                log.info("success invoke - listEvents");
                return resolve(response);

            }).catch((error: any) => {
                log.error("error invoke - listEvents");
                return reject(error);
            });
        }).catch( (err: any) => {
            log.error("error invoke - listEvents - validateToken");
            reject(err);
        } );
    });
};

const removeAll = ( token: string ) => {
    log.info("invoke - RemoveAll Event");
    return new Promise((resolve, reject) => {
        AuthController.valideToken(token).then((infoToken: any) => {
            Queries.getEventByUser( infoToken.user.oid ).then((results: any) => {
                let listPromise = [];
                for ( let item of results ) {
                    listPromise.push( Queries.deleteEvent( item ) );
                }

                Promise.all( listPromise ).then( (val: any) => {
                    resolve(true);
                } ).catch( (e: any) => {
                    reject(false);
                });

            }).catch((error: any) => {
                log.error("error invoke - RemoveAll Event - getSubcriptionByUser", error);
                return reject(error);
            });
        }).catch( (err: any) => {
            log.error("error invoke - RemoveAll Event - valideToken");
            return reject(err);
        } );
    });
};

export default {
    listEvents,
    removeAll
};
