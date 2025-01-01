import { Request, Response } from "express";
import * as userModel from "../models/userModel";

export const createUser = async (req: Request, res: Response) => {
  try {
    await userModel.createUser(req.body);
    res.status(201).send("Registration successful");
  } catch (error) {
    res.status(500).send("Error adding user");
  }
};

export const getUserBooks = async (req: Request, res: Response) => {
  const user_id = parseInt(req.body.user_id); // Ensure user_id is parsed as a number

  try {
    const books = await userModel.getUserBooks(user_id);
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Error retrieving books");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const user_id = parseInt(req.body.user_id); // Ensure user_id is parsed as a number
  try {
    const user = await userModel.getUserById(user_id);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Error retrieving user");
  }
};

export const getUserFavorites = async (req: Request, res: Response) => {
  const user_id = parseInt(req.body.user_id); // Ensure user_id is parsed as a number

  try {
    const favorites = await userModel.getUserFavorites(user_id);
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorite books:", error);
    res.status(500).send("Error retrieving favorite books");
  }
};