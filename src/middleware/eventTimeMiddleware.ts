import type { Request, Response, NextFunction } from "express";

export function eventTimeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // list of blocked routes
  const blockedRoutes = [
    "/group/leave",
    "/group/kick",
    "/group/confirm",
    "/group/invite/regenerate",
    "/group/join",
    "/group/house-preferences",
  ];

  if (blockedRoutes.includes(req.url) && req.method === "POST") {
    res.status(403).json({
      success: false,
      error: "This route is blocked during the event time.",
      timestamp: new Date().toISOString(),
    });
    return;
  }
  next();
}
