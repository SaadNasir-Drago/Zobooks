import { Request, Response } from "express";
import * as authModel from "../models/authModel";
import jwt from "jsonwebtoken";
require("dotenv").config();

export const verifyUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userData = await authModel.getUserByEmail(email);

    if (!userData) {
      return res.status(404).send("User not found");
    }

    if (userData.password !== password) {
      return res.status(403).send("Invalid Login");
    }

    delete userData.password;

    const token = jwt.sign(userData, process.env.SECRET as string, {
      expiresIn: "3h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 3000,
    });

    res.setHeader("Content-Type", "application/json");
    return res
      .status(200)
      .json({ message: "Login successful", token, userData });
  } catch (error) {
    console.error("Error in verifyUser:", error);
    return res.status(500).send("Internal server error");
  }
};
