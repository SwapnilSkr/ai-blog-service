import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    console.log("Authenticated user", user);
    return res.status(StatusCodes.CREATED).json({
      message: "success",
      user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(StatusCodes.OK).json({
      message: "failed",
      error,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    console.log("Authenticated user", user);
    return res.status(StatusCodes.OK).json({
      message: "success",
      user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(StatusCodes.OK).json({
      message: "failed",
      error,
    });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      err: "No user in session",
    });
  }
  req.logout((err) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
};
