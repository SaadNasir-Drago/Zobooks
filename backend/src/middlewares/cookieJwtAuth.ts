import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

// Extend the Request interface to include the user
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      user_id: number;
    };
  }
}

export const cookieJwtAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.SECRET as string
    ) as jwt.JwtPayload;

    if (decodedToken && decodedToken.user_id) {
      req.body.user_id = parseInt(decodedToken.user_id, 10);
    }

    next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(403).send("Token expired or invalid.");
  }
};
