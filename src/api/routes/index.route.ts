import { Router } from "express";
import DatabaseRouter from "./database.routes";
import TrackerRouter from "./tracker.routes";

class BaseRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.mountRoutes();
  }

  mountRoutes() {
    this.router.use("/", DatabaseRouter);
    this.router.use("/", TrackerRouter);
  }
}

export = new BaseRouter().router;
