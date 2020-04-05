//  database
import { createConnection } from "typeorm";
import { typeOrmConfig } from "./database/config";

import dotenv from "dotenv";
import express from "express";

import http from "http";

import * as routes from "./routes";
import * as auth from "./routes/auth";
import * as swaggerDoc from "./swaggerDoc";

const env = dotenv.config().parsed || process.env;

function makeAPI(): express.Application {
    const app = express();
    app.use( express.json() );

    return app;
}

async function startHTTPServer( app: express.Application )    {
    const httpServer = http.createServer( app );
    httpServer.listen( env.HTTP_PORT  || 3000);
}

( async () => {
     // const conn = await createConnection( typeOrmConfig( env ) );
    //  PG connected
    const app = makeAPI();
    //  configure routes
    routes.register( app/*, conn*/);
    auth.register( app/*, conn*/);

    //  configure middlewares
    swaggerDoc.register( app );

    startHTTPServer( app );
} )();
