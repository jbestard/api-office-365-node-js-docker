import {Request, Response} from "express";
import * as express from "express";
import { Connection } from "typeorm";
import eventsController from "../controllers/eventsController";
import eventsParse from "../services/eventsParse";
import log from "../services/logger";

export const register = ( app: express.Application, conn?: Connection ) => {

    app.post( "/v1/events/list", ( req: Request, res: Response ) => {
        let token = req.headers.authorization;
        log.info("token headers: ", token);
        let maxResults: number = req.body.maxResults;
        let timeMin = req.body.timeMin;
        let timeMax = req.body.timeMax;
        let singleEvents: boolean = req.body.singleEvents;
        let nextPageToken: number = req.body.nextPageToken;
        let nextSyncToken = req.body.nextSyncToken;

        eventsController.listEvents(token, maxResults, timeMin, timeMax, singleEvents, nextPageToken, nextSyncToken).then( (result: any) => {

            res.status(200).json({
                events: eventsParse( result, maxResults, nextPageToken, nextSyncToken )
            });

        } ).catch( (err: any) => {
            let msgErr = "";
            if ( err && err.error === "NO_ID_PROVIDED" ) {
                msgErr = "NO TOKEN RECORD 'ID' PROVIDED";
            } else {
                msgErr = "INVALID_GRANT (BAD REQUEST)";
            }

            res.status(400).json({
                error: msgErr
            });
        });
    });

    app.post( "/v1/events/list/allpages", ( req: Request, res: Response ) => {
        let token = req.headers.authorization;
        let maxResults: number = req.body.maxResults;
        let timeMin = req.body.timeMin;
        let timeMax = req.body.timeMax;
        let singleEvents: boolean = req.body.singleEvents;
        let nextSyncToken = req.body.nextSyncToken;

        eventsController.listEvents(token, maxResults, timeMin, timeMax, singleEvents, null, nextSyncToken).then( (result: any) => {

            let eventRes: any = eventsParse( result, maxResults, null, nextSyncToken );

            if ( eventRes && eventRes.nextPageToken ) {
                delete eventRes.nextPageToken;
            }

            res.status(200).json({
                events: eventRes
            });

        } ).catch( (err: any) => {
            let msgErr = "";
            if ( err && err.error === "NO_ID_PROVIDED" ) {
                msgErr = "NO TOKEN RECORD 'ID' PROVIDED";
            } else {
                msgErr = "INVALID_GRANT (BAD REQUEST)";
            }

            res.status(400).json({
                error: msgErr
            });
        });
    });

};
