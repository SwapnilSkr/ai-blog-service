import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const authCheckMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "failed",
        error: "You are not authenticated!",
      });
    }
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "failed",
      error,
    });
  }
};
