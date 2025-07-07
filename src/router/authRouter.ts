import { BaseRouter } from "./baseRouter";
import { AuthController } from "../controller/auth/authController";

export class AuthRouter extends BaseRouter {
  private authController!: AuthController;

  constructor() {
    super({
      prefix: "/auth",
    });
    this.authController = new AuthController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      "/register",
      this.authController.register.bind(this.authController)
    );
  }
}
