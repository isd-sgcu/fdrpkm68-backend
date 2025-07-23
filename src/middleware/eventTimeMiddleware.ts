import type { Request, Response, NextFunction } from "express";

export function eventTimeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // list of blocked routes
  const blockedRoutes = [
    "/leave",
    "/kick",
    "/confirm",
    "/invite/regenerate",
    "/join",
    "/house-preferences",
  ];

  if (
    blockedRoutes.some((route) => req.path.includes(route)) &&
    req.method !== "GET"
  ) {
    res.status(403).json({
      success: false,
      error: "This route is blocked during the event time.",
      timestamp: new Date().toISOString(),
    });
    return;
  }
  next();
}
