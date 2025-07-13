import { CheckinController } from "@/controller/checkin/checkinController";

import { BaseRouter } from "./baseRouter";
import { authMiddleware } from "../middleware/authMiddleware";


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
      "/create",
      this.checkinController.createCheckin.bind(this.checkinController)
    );
    // Create a new check-in by userId and Time
    this.router.post(
    "/createByUserId",
    this.checkinController.createCheckinByUserId.bind(this.checkinController)
  );
    // Update a check-in
    // this.router.put(
    //   "/:id",
    //   this.checkinController.updateCheckin.bind(this.checkinController)
    // );
  }
}
