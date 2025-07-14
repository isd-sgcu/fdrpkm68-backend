import { RpkmController } from "@/controller/rpkm/rpkmController";
import { authMiddleware } from "@/middleware/authMiddleware";

import { BaseRouter } from "./baseRouter";

export class RpkmWorkshopRouter extends BaseRouter {
    private rpkmController: RpkmController;

    constructor() {
        super({
            prefix: "/workshop",
        });
        this.rpkmController = new RpkmController();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.use(authMiddleware);

        this.router.get(
            "/counts",
            this.rpkmController.getWorkshopsParticipantCounts.bind(this.rpkmController)
        );

        this.router.post(
            "/",
            this.rpkmController.registerWorkshop.bind(this.rpkmController)
        );

        this.router.get(
            "/me",
            this.rpkmController.getWorkshopsOfUserId.bind(this.rpkmController)
        );
    }
}