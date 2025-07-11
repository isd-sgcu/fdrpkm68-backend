import { BaseRouter } from "./baseRouter";
import { CheckinController } from "@/controller/checkin/checkinController";
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

    // Get a check-in by id
    // this.router.get(
    //   "/",
    //   this.checkinController.getCheckinById.bind(this.checkinController)
    // );

    // Get a check-in by userId and event
    this.router.get(
      "/:userId/:event",
      this.checkinController.getCheckinByUserIdAndEvent.bind(this.checkinController)
    );

    // Create a new check-in
    this.router.post(
      "/",
      this.checkinController.createCheckin.bind(this.checkinController)
    );

    // Update a check-in
    // this.router.put(
    //   "/:id",
    //   this.checkinController.updateCheckin.bind(this.checkinController)
    // );
  }
}
