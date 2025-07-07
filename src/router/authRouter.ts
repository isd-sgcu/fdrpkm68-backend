import { BaseRouter } from "./baseRouter";
import { AuthController } from "../controller/auth/authController";

export class AuthRouter extends BaseRouter {
  private authController: AuthController;

  constructor() {
    super({
      prefix: "/auth",
    });
    this.authController = new AuthController();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/login",
      this.authController.login.bind(this.authController)
    );
  }
}
