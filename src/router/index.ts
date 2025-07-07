import { Router } from "express";
import { AuthRouter } from "./authRouter";

export class RouterManager {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    const authRouter = new AuthRouter();
    this.router.use("/auth", authRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
