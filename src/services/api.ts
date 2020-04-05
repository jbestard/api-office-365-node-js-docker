/**
 * Created by Bestard
 */
import axios from "axios";
// import * as pd from "pretty-data";
import log from "./logger";

const get = (serviceUrl: string, headers: any, params: any = {}) => {
    log.info("GET", serviceUrl);
    return new Promise((resolve, reject) => {
        axios.get( serviceUrl, { headers, params } )
        .then((response: any) => {
            log.info("GET SUCCESS", serviceUrl);
            return resolve ( response.data );
        })
        .catch((err: any) => {
            log.error("GET ERROR", serviceUrl);
            if ( err && err.response && err.response.data) {
                log.error(err.response.data);
            }
            return reject(err);
        });
    });
};

const post = (serviceUrl: string, headers: any, data: any) => {
    log.info("POST", serviceUrl);
    return new Promise((resolve, reject) => {
            axios.request({
            url: serviceUrl,
            method: "POST",
            timeout: 999999999,
            headers,
            data,
        })
        .then((response: any) => {
            log.info("POST SUCCESS", serviceUrl);
            return resolve ( response.data );
        })
        .catch((err: any) => {
            log.error("POST ERROR", serviceUrl);
            if ( err && err.response && err.response.data) {
                log.error(err.response.data);
            }
            return reject(err);
        });
    });
};

const patch = (serviceUrl: string, headers: any, data: any) => {
    log.info("PATCH", serviceUrl);
    return new Promise((resolve, reject) => {
            axios.request({
            url: serviceUrl,
            method: "PATCH",
            timeout: 999999999,
            headers,
            data,
        })
        .then((response: any) => {
            log.info("PATCH SUCCESS", serviceUrl);
            return resolve ( response.data );
        })
        .catch((err: any) => {
            log.error("PATCH ERROR", serviceUrl);
            if ( err && err.response && err.response.data) {
                log.error(err.response.data);
            }
            return reject(err);
        });
    });
};

const deleteRequest = (serviceUrl: string, headers: any, data: any) => {
    log.info("DELETE", serviceUrl);
    return new Promise((resolve, reject) => {
            axios.request({
            url: serviceUrl,
            method: "DELETE",
            timeout: 999999999,
            headers,
            data,
        })
        .then((response: any) => {
            log.info("DELETE SUCCESS", serviceUrl);
            return resolve ( response.data );
        })
        .catch((err: any) => {
            log.error("DELETE ERROR", serviceUrl);
            if ( err && err.response && err.response.data) {
                log.error(err.response.data);
            }
            return reject(err);
        });
    });
};

export default {
    get,
    post,
    patch,
    deleteRequest
};
