import {Request, Response} from "express";
import * as express from "express";
import { Connection } from "typeorm";
import authController from "../controllers/authController";

export const register = ( app: express.Application, conn?: Connection ) => {

    app.get( "/v1/auth-url", ( req: Request, res: Response ) => {
        res.status(200).json({
            URL: authController.generateAuthUrl()
        });
    });

    app.get( "/v1/token", ( req: Request, res: Response ) => {
        if ( !req.query.CODE ) {
           return res.status(400).json({
                    ERROR: "FIELD 'CODE' IS REQUIRED ON QUERYSTRING"
            });
        }

        authController.getToken(req.query.CODE).then( (result: any) => {
            res.status(200).json({
                TOKEN: {
                    ACCESS_TOKEN: result.access_token,
                    EXPIRES_IN: result.expires_in,
                    REFRESH_TOKEN: result.refresh_token,
                    SCOPE: result.scope,
                    TOKEN_TYPE: result.token_type
                }
            });
        } ).catch( (err: any) => {
            res.status(400).json({
                ERROR: "INVALID_GRANT (BAD REQUEST)"
            });
        });
    });

    app.get( "/v1/token/refresh", ( req: Request, res: Response ) => {
        if ( !req.query.REFRESH_TOKEN ) {
           return res.status(400).json({
                    ERROR: "FIELD 'REFRESH_TOKEN' IS REQUIRED ON QUERYSTRING"
            });
        }

        authController.getRefreshToken(req.query.REFRESH_TOKEN).then( (result: any) => {
            res.status(200).json({
                TOKEN: {
                    ACCESS_TOKEN: result.access_token,
                    EXPIRES_IN: result.expires_in,
                    SCOPE: result.scope,
                    TOKEN_TYPE: result.token_type
                }
            });
        } ).catch( (err: any) => {
            res.status(400).json({
                ERROR: "INVALID_GRANT (BAD REQUEST)"
            });
        });
    });

};
