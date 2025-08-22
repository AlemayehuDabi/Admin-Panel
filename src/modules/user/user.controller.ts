// src/modules/user/user.controller.ts
import { Request, Response, NextFunction } from "express";
import { successResponse, errorResponse } from "@/utils/response";
import { UserService } from "./user.service";
import { UserStatus, UserRole, VerificationStatus } from "@generated/prisma";

export class UserController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        email,
        role,
        status,
        verification,
        dateFrom,
        dateTo,
        page,
        limit,
      } = req.query;

      const data = await UserService.listUsers({
        email: email as string | undefined,
        role: role as UserRole | undefined,
        status: status as UserStatus | undefined,
        verification: verification as VerificationStatus | undefined,
        dateFrom: dateFrom as string | undefined,
        dateTo: dateTo as string | undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      return successResponse(data, "Users fetched");
    } catch (err) {
      return next(err);
    }
  }

  static async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await UserService.setStatus(id, "ACTIVE");
      return successResponse(updated, "User activated");
    } catch (err) {
      return next(err);
    }
  }

  static async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await UserService.setStatus(id, "INACTIVE");
      return successResponse(updated, "User deactivated");
    } catch (err) {
      return next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body as { newPassword: string };
      if (!newPassword || newPassword.length < 8) {
        return errorResponse("Password must be at least 8 characters", 400);
      }
      await UserService.resetPassword(id, newPassword);
      return successResponse({ id }, "Password reset and sessions invalidated");
    } catch (err) {
      return next(err);
    }
  }

  static async forceLogout(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await UserService.forceLogout(id);
      return successResponse({ id }, "All sessions invalidated");
    } catch (err) {
      return next(err);
    }
  }

  static async ensureReferralCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const code = await UserService.ensureReferralCode(id);
      return successResponse(code, "Referral code ready");
    } catch (err) {
      return next(err);
    }
  }

  static async getReferrals(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await UserService.getReferralsByUser(id);
      return successResponse(data, "Referred users fetched");
    } catch (err) {
      return next(err);
    }
  }

  static async referralStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserService.getReferralStats();
      return successResponse(data, "Referral stats fetched");
    } catch (err) {
      return next(err);
    }
  }
} 
