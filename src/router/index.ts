import { Router } from "express";

import { AuthRouter } from "./authRouter";
import { CheckinRouter } from "./checkinRouter";
import { GroupRouter } from "./groupRouter";
import { HouseRouter } from "./houseRouter";
import { RpkmWorkshopRouter } from "./rpkmWorkshopRouter";
import { UserRouter } from "./userRouter";

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
    const userRouter = new UserRouter();
    const checkinRouter = new CheckinRouter();
    const rpkmWorkshopRouter = new RpkmWorkshopRouter();

    this.router.use("/auth", authRouter.getRouter());
    this.router.use("/group", groupRouter.getRouter());
    this.router.use("/houses", houseRouter.getRouter());
    this.router.use("/user", userRouter.getRouter());
    this.router.use("/checkin", checkinRouter.getRouter());
    this.router.use("/workshop", rpkmWorkshopRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
