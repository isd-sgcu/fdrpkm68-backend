import { Router } from "express";
import { AuthRouter } from "./authRouter";
import { GroupRouter, HouseRouter } from "./groupRouter";

export class RouterManager {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    const authRouter = new AuthRouter();
    const groupRouter = new GroupRouter();
    const houseRouter = new HouseRouter();

    this.router.use("/auth", authRouter.getRouter());
    this.router.use("/group", groupRouter.getRouter());
    this.router.use("/houses", houseRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
