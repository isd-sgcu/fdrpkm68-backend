import { GroupController } from "@/controller/group/groupController";
import { authMiddleware } from "@/middleware/authMiddleware";

import { BaseRouter } from "./baseRouter";
import { eventTimeMiddleware } from "../middleware/eventTimeMiddleware";

export class GroupRouter extends BaseRouter {
  private groupController: GroupController;

  constructor() {
    super({
      prefix: "/group",
    });
    this.groupController = new GroupController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.use(authMiddleware);
    this.router.use(eventTimeMiddleware);

    this.router.get(
      "/",
      this.groupController.getGroup.bind(this.groupController)
    );

    this.router.post(
      "/getGroupByGroupId",
      this.groupController.getGroupByGroupId.bind(this.groupController)
    );

    this.router.post(
      "/",
      this.groupController.createGroup.bind(this.groupController)
    );

    this.router.patch(
      "/leave",
      this.groupController.leaveGroup.bind(this.groupController)
    );

    this.router.post(
      "/kick",
      this.groupController.kickMember.bind(this.groupController)
    );

    this.router.post(
      "/confirm",
      this.groupController.confirmGroup.bind(this.groupController)
    );

    this.router.post(
      "/invite/regenerate",
      this.groupController.regenerateInviteCode.bind(this.groupController)
    );

    this.router.post(
      "/join",
      this.groupController.joinGroup.bind(this.groupController)
    );

    this.router.get(
      "/invite-code",
      this.groupController.getInviteCode.bind(this.groupController)
    );

    this.router.post(
      "/house-preferences",
      this.groupController.setHousePreferences.bind(this.groupController)
    );

    this.router.post(
      "/groupByInviteCode",
      this.groupController.getGroupByInviteCode.bind(this.groupController)
    );

    this.router.get(
      "/house-preferences",
      this.groupController.getHousePreferences.bind(this.groupController)
    );
  }
}

export class HouseRouter extends BaseRouter {
  private groupController: GroupController;

  constructor() {
    super({
      prefix: "/houses",
    });
    this.groupController = new GroupController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/",
      this.groupController.getAllHouses.bind(this.groupController)
    );
  }
}
