import { Request, Response } from "express";
import { User } from "../models/user";

const createCurrentUser = async (req: Request, res: Response) => {
  const { auth0Id, email } = req.body;

  if (!auth0Id || !email) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const userExists = await User.findOne({ auth0Id });
  if (userExists) {
    return res.sendStatus(200);
  }

  const user = await User.create(req.body);
  res.status(201).json(user);
};

export default { createCurrentUser };
