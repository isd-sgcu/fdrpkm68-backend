import { BaseRouter } from "@/router/baseRouter";
import { HouseController } from "@/controller/house/houseController";

export class HouseRouter extends BaseRouter {
  private houseController!: HouseController;

  constructor() {
    super({
      prefix: "/houses",
    });
    this.houseController = new HouseController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // GET /api/houses - Get all houses
    this.router.get(
      "/",
      this.houseController.getAllHouses.bind(this.houseController)
    );

    // GET /api/houses/:id - Get house by ID
    this.router.get(
      "/:id",
      this.houseController.getHouseById.bind(this.houseController)
    );
  }
}
