import {Request, Response} from "express";
import * as express from "express";
import { Connection } from "typeorm";
import authController from "../controllers/authController";

export const register = ( app: express.Application, conn?: Connection ) => {

    app.get( "/v1/auth-url", ( req: Request, res: Response ) => {
        res.status(200).json({
            url: authController.generateAuthUrl()
        });
    });

    app.get( "/v1/token", ( req: Request, res: Response ) => {
        if ( !req.query.code ) {
           return res.status(400).json({
                    error: "FIELD 'CODE' IS REQUIRED ON QUERYSTRING"
            });
        }

        authController.getToken(req.query.code).then( (result: any) => {
            res.status(200).json({
                token: {
                    access_token: result.access_token,
                    expires_in: result.expires_in,
                    refresh_token: result.refresh_token,
                    scope: result.scope,
                    token_type: result.token_type
                }
            });
        } ).catch( (err: any) => {
            res.status(400).json({
                error: "INVALID_GRANT (BAD REQUEST)"
            });
        });
    });

    app.get( "/v1/token/refresh", ( req: Request, res: Response ) => {
        if ( !req.query.refresh_token ) {
           return res.status(400).json({
                    error: "FIELD 'refresh_token' IS REQUIRED ON QUERYSTRING"
            });
        }

        authController.getRefreshToken(req.query.refresh_token).then( (result: any) => {
            res.status(200).json({
                token: {
                    access_token: result.access_token,
                    expires_in: result.expires_in,
                    scope: result.scope,
                    token_type: result.token_type
                }
            });
        } ).catch( (err: any) => {
            res.status(400).json({
                error: "INVALID_GRANT (BAD REQUEST)"
            });
        });
    });

    app.post( "/v1/token/cancel-sync", ( req: Request, res: Response ) => {
        let token = req.headers.authorization;
        authController.cancelSync(token).then( (result: any) => {
            res.status(200).json({ affectedTokens: 1 });
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
