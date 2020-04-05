/**
 * Created by Bestard
 */
import * as express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swaggerJson";

var options = {
  // customCssUrl: "./customSwaggerUi.css"
  // customCss: ".models{ display: none !important; }"
};

export const register = ( app: express.Application ) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
  app.get("/api-docs.json", (req: any, res: any) => {
      res.send(swaggerDocument);
  });
};
