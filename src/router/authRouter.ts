import { BaseRouter } from "./baseRouter";
import { AuthController } from "@/controller/auth/authController";
import { authMiddleware } from "@/middleware/authMiddleware";
import { UserController } from "@/controller/user/userController";

export class AuthRouter extends BaseRouter {
  private authController: AuthController;
  private userController: UserController;

  constructor() {
    super({
      prefix: "/auth",
    });
    this.authController = new AuthController();
    this.userController = new UserController();
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
      this.userController.registerStaff.bind(this.userController)
    );
  }
}
