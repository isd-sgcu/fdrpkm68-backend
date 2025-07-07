import { Router, Request, Response, NextFunction } from "express";

export interface BaseRouterOptions {
  prefix?: string;
  middleware?: Array<(req: Request, res: Response, next: NextFunction) => void>;
}

export class BaseRouter {
  public router: Router;
  private prefix: string;

  constructor(options: BaseRouterOptions = {}) {
    this.router = Router();
    this.prefix = options.prefix ?? "";

    if (options.middleware) {
      options.middleware.forEach((middleware) => {
        this.router.use(middleware);
      });
    }

    this.router.use(this.requestLogger);

    this.initializeRoutes();
  }

  private requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${this.prefix}${req.path}`
    );
    next();
  };

  protected initializeRoutes(): void {}

  public getRouter(): Router {
    return this.router;
  }
}
