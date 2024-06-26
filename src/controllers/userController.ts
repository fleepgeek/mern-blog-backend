import { Request, Response } from "express";
import { User } from "../models/user";

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id, email } = req.body;

    if (!auth0Id || !email) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ auth0Id });
    if (userExists) {
      return res.sendStatus(200);
    }

    const user = await User.create(req.body);
    res.status(201).send(user);
    // res.status(201).json(user.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "User creation failed!" });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).select("-auth0Id");

    if (!user) {
      return res.sendStatus(404);
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed getting user!" });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  const { userId } = req;
  const { name, bio } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    return res.sendStatus(404);
  }

  user.name = name;
  user.bio = bio;

  await user.save();
  res.sendStatus(200);
};

export default { createCurrentUser, updateCurrentUser, getCurrentUser };
