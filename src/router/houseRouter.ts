import { HouseController } from "@/controller/house/houseController";
import { authMiddleware } from "@/middleware/authMiddleware";
import { BaseRouter } from "@/router/baseRouter";

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
    this.router.use(authMiddleware);

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
