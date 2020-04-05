// Config that is common to more than one part of the app.
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export function typeOrmConfig( env: any ): PostgresConnectionOptions  {
    const options: PostgresConnectionOptions = {
        type: "postgres",
        url: env.DB_URL || "postgres://postgres:changeme@database:5432/office-sync-db",
        synchronize: true,
        logging: false,
        entities: [
            __dirname + "/entities/*.js"
        ]
    };

    return options;
}
