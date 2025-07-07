import { BaseRouter } from "./baseRouter";
import { CheckinController } from "@/controller/checkin/checkinController";
import { mockAuthMiddleware } from "@/middleware/mockAuth";

export class CheckinRouter extends BaseRouter {
  private checkinController: CheckinController;

  constructor() {
    super({
      prefix: "/checkin",
    });
    this.checkinController = new CheckinController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.use(mockAuthMiddleware);

    // Get a check-in by id
    this.router.get(
      "/",
      this.checkinController.getCheckinById.bind(this.checkinController)
    );

    // Create a new check-in
    this.router.post(
      "/",
      this.checkinController.createCheckin.bind(this.checkinController)
    );

    // Update a check-in
    this.router.put(
      "/:id",
      this.checkinController.updateCheckin.bind(this.checkinController)
    );
  }
}
