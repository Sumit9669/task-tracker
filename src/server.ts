import cookieParser from "cookie-parser";
import "reflect-metadata";
import express from "express";
import "express-async-errors";
import cors from "cors";
import HttpErrorMiddleware from "./middlewares/http-error-middleware";
import BaseRouter from "src/api/routes/index.route";
import { SwaggerConfig } from "./config/swagger.config";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

class App {
  public express: any;

  constructor() {
    this.express = express();
    this.setUpConfiguration();
  }

  private setUpConfiguration(): void {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cookieParser());

    // To get error stack upto 20 lines
    Error.stackTraceLimit = 20;

    // Add APIs
    this.express.use("/", BaseRouter);
    // error middleware
    this.express.use(HttpErrorMiddleware);

    // swagger middleware
    const swaggerDocs = swaggerJSDoc(SwaggerConfig);
    this.express.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocs)
    );

    // Cors
    this.express.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.header("Access-Control-Allow-Origin", "*"); // Will update DOmain later here
        res.header("Access-Control-Allow-Headers", "*");
        next();
      }
    );
  }
}

export default new App().express;
