import * as express from "express";
import { Connection } from "typeorm";
import log from "../services/logger";

export const register = ( app: express.Application, conn?: Connection ) => {

    // define a route handler for the default home page
    app.get( "/", ( req, res ) => {
        log.info("Hello word!");
        res.send( "Hello world!" );
    } );

};
