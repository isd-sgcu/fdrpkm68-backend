import { CheckinController } from "@/controller/checkin/checkinController";
import { authMiddleware } from "@/middleware/authMiddleware";

import { BaseRouter } from "./baseRouter";

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
    this.router.use(authMiddleware);

    // Get a check-in by userId and event
    this.router.get(
      "/:event",
      this.checkinController.getCheckinByUserIdAndEvent.bind(this.checkinController)
    );

    // Create a new check-in
    this.router.post(
      "/register",
      this.checkinController.register.bind(this.checkinController)
    );

    // Create a new check-in by userId and Time
    this.router.post(
      "/registerByStaff",
      this.checkinController.registerByStaff.bind(this.checkinController)
    );
    // Update a check-in
    // this.router.put(
    //   "/:id",
    //   this.checkinController.updateCheckin.bind(this.checkinController)
    // );
  }
}
