// middleware/roleMiddleware.ts
import { AuthRequest } from "./authMiddleware";
import { Response, NextFunction } from "express";

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("User role:", req.user?.role);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
