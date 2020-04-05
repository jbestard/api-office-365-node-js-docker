/**
 * Created by Bestard
 */

import log4js from "log4js";

log4js.configure({
    appenders: {
        everything: { type: "file", filename: "log/archivo.log", maxLogSize: 1000000 }
    },
    categories: {
        default: { appenders: [ "everything" ], level: "debug" }
    }
});

const logger = () => {
    return log4js.getLogger();
};

export default log4js.getLogger();
