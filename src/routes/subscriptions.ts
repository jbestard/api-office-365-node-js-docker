import {Request, Response} from "express";
import * as express from "express";
import { Connection } from "typeorm";
import subscriptionsController from "../controllers/subscriptionsController";

export const register = ( app: express.Application, conn?: Connection ) => {

    app.post( "/notification", ( req: Request, res: Response ) => {
        res.status(200).send(req.query.validationtoken);
    });

    app.post( "/v1/events/channel/new", ( req: Request, res: Response ) => {
        let token = req.headers.authorization;
        let expirationHours: number = ( req.body.expirationHours ) ? req.body.expirationHours : 24;

        subscriptionsController.create( token, expirationHours ).then( ( result: any ) => {
            res.status(200).json({
                kind: "API#CHANNEL",
                id: result.Id,
                resourceId: result.Id,
                resourceUrl: result.Resource,
                expiration: (new Date(result.SubscriptionExpirationDateTime)).getTime()
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
        } );
    });

    app.post( "/v1/channels/renew", ( req: Request, res: Response ) => {
        let token = req.headers.authorization;
        let expirationHours: number = ( req.body.expirationHours ) ? req.body.expirationHours : 24;

        subscriptionsController.renewAll( token, expirationHours ).then( ( result: any ) => {
            res.status(200).json(result);
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
        } );
    });

    app.post( "/v1/events/channel/stop", ( req: Request, res: Response ) => {
        let token = req.headers.authorization;

        subscriptionsController.removeAll( token ).then( ( result: any ) => {
            res.status(200).json({});
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
        } );
    });
};
