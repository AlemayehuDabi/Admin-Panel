import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.user = decoded;

    const isForceLogout = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { tokenVersion: true },
    });

    if (!isForceLogout || typeof isForceLogout.tokenVersion !== "number" || isForceLogout.tokenVersion > 0) {
      return res.status(401).json({ message: "User is logged out" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
