// Config that is common to more than one part of the app.
import { Connection } from "typeorm";
import { createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import Event from "./entities/event.entities";
import Subcription from "./entities/subcription.entities";
import User from "./entities/user.entities";
/*
var db: any;

const connect = async ( env: any ) => {
  const options: PostgresConnectionOptions = {
    type: "postgres",
    url: env.DB_URL || "postgres://postgres:changeme@database:5432/office-sync-db",
    synchronize: true,
    logging: false,
    entities: [
        Post,
        User,
        Event,
        Subcription
    ]
  };

  try {
    db = await createConnection(options);
    console.log("connecting to the database: ok");
  } catch (error) {
    console.log("Error while connecting to the database", error);
    // return error;
  }
};

const getConnection = ( ) => {
  if (!db) {
      // logger.error('ERROR: Error de conexión.');
      console.error("ERROR: Error de conexión.");
      return null;
  }
  return db;
};*/

import dotenv from "dotenv";
const env = dotenv.config().parsed || process.env;

class Database {

  public static getInstance(): Database {
      if (!Database.instance) {
        Database.instance = new Database();
         // console.log("Error while connecting to the database");
          // return null;
      }

      return Database.instance;
  }
  private static instance: Database;
  public db: Connection;

  private constructor( ) {
    const options: PostgresConnectionOptions = {
      type: "postgres",
      url: env.DB_URL || "postgres://postgres:changeme@database:5432/office-sync-db",
      synchronize: true,
      logging: false,
      entities: [
          User,
          Event,
          Subcription
      ]
    };

    let self = this;
    createConnection(options).then( (conn: any) => {
      self.db = conn;
      console.log("connecting to the database: ok");
    } ).catch( (err: any) => {
      console.log("Error while connecting to the database", err);
    });
  }
}

export default Database;
