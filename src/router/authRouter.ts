
import { AuthController } from "@/controller/auth/authController";
import { authMiddleware } from "@/middleware/authMiddleware";
import { UserController } from "@/controller/user/userController";

import { BaseRouter } from "./baseRouter";

export class AuthRouter extends BaseRouter {
  private authController: AuthController;

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
    this.router.post(
      "/login",
      this.authController.login.bind(this.authController)
    );
    this.router.post(
      "/forgot-password",
      this.authController.forgotPassword.bind(this.authController)
    );
    this.router.post(
      "/logout",
      authMiddleware,
      this.authController.logout.bind(this.authController)
    );
    this.router.post(
      "/staff-register",
      this.authController.registerStaff.bind(this.authController)
    );
  }
}
