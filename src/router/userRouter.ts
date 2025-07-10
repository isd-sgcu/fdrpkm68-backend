import { BaseRouter } from "./baseRouter";
import { UserController } from "@/controller/user/userController";
import { authMiddleware } from "@/middleware/authMiddleware";

export class UserRouter extends BaseRouter {
  private userController: UserController;

  constructor() {
    super({
      prefix: "/user",
    });
    this.userController = new UserController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.use(authMiddleware);

    this.router.get("/", this.userController.get.bind(this.userController));

    this.router.patch(
      "/update",
      this.userController.update.bind(this.userController)
    );
  }
}
