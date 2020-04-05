
import qs from "querystring";
import config from "../config";
import api from "../services/api";
import log from "../services/logger";

const generateAuthUrl = (  ) => {
    log.info("invoke - generateAuthUrl");
    let urlService = config.urls.authorize;

    urlService += "?client_id=" + config.client_id;
    urlService += "&redirect_uri=" + config.redirect_uri;
    urlService += "&response_type=code";
    urlService += "&response_mode=query";
    urlService += "&scope=" + config.scope1.join(" ");
    urlService += "&state=12345";

    return urlService;
};
const getToken = ( code: string ) => {
    log.info("invoke - getToken");
    log.info("code", code);
    return new Promise((resolve, reject) => {
        let headers = {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8"
        };

        let data = {
            client_id: config.client_id,
            scope: config.scope2.join(" "),
            redirect_uri: config.redirect_uri,
            client_secret: config.client_secret,
            grant_type: "authorization_code",
            code
        };

        api.post(config.urls.token, headers, qs.stringify(data)).then( ( response: any) => {
            log.info("success invoke - getToken");
            return resolve(response);
        } ).catch((error: any) => {
            log.error("error invoke - getToken");
            return reject(error);
        });
    });
};
const getRefreshToken = ( refreshToken: string ) => {
    log.info("invoke - getRefreshToken");
    log.info("refreshToken", refreshToken);
    return new Promise((resolve, reject) => {
        let headers = {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8"
        };

        let data = {
            client_id: config.client_id,
            scope: config.scope2.join(" "),
            redirect_uri: config.redirect_uri,
            client_secret: config.client_secret,
            grant_type: "refresh_token",
            refresh_token: refreshToken
        };

        api.post(config.urls.token, headers, qs.stringify(data)).then( ( response: any) => {
            log.info("success invoke - getRefreshToken");
            return resolve(response);
        } ).catch((error: any) => {
            log.error("error invoke - getRefreshToken");
            return reject(error);
        });
    });
};

export default {
    generateAuthUrl,
    getToken,
    getRefreshToken
};
