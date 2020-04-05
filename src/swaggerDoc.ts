/**
 * Created by Bestard
 */
import * as express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swaggerJson";

export const register = ( app: express.Application ) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get("/api-docs.json", (req: any, res: any) => {
      res.send(swaggerDocument);
  });
};
