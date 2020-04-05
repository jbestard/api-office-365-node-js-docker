import { Base64 } from "js-base64";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
const env = dotenv.config().parsed || process.env;

class Auth {
    public static getInstance(): Auth {
        if (!Auth.instance) {
            Auth.instance = new Auth();
        }
  
        return Auth.instance;
    }
    private static instance: Auth;
    public urlBase: string;
    public access_token: string;
    public refresh_token: string;
    public code: string;
    public tmp:number;

    private constructor( ) {
        this.urlBase = env.URL_BASE;
        this.access_token = null;
        this.refresh_token = null;
        this.code = env.CODE_API;
        this.tmp = 0;
    }

    public getOid (  ):string {
        return this.valideToken( this.access_token );
    } 

    public valideToken ( token:string ):string {
        let tmp = Base64.decode( token ).split("2020IRIS365");
        if ( tmp.length !== 2 ) {
            return null;
        }

        let infoUser: any = null;

        try {
            infoUser = jwt.decode(tmp[1]);
            if ( !infoUser.oid ) {
                return null;
            }else{
                return infoUser.oid;
            }

          } catch (error) {
            return null;
          }
    }
  }
  
  export default Auth.getInstance();
  
