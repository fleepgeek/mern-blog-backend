import { Request, Response } from "express";
import User from "../models/user";
import Article from "../models/article";
import { ObjectId } from "mongodb";

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
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed updating user!" });
  }
};

const addBookmark = async (req: Request, res: Response) => {
  try {
    const id = req.body.id as string;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.sendStatus(404);
    }

    user.bookmarkedIds = [...user.bookmarkedIds, new ObjectId(id)];

    await user.save();

    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding bookmark" });
  }
};

const removeBookmark = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.sendStatus(404);
    }

    user.bookmarkedIds = user.bookmarkedIds.filter(
      (bookmarkId) => bookmarkId.toString() !== id
    );

    await user.save();

    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding bookmark" });
  }
};

const getBookmarks = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userBookmarkedArticles = await Article.find({
      _id: { $in: user.bookmarkedIds },
    })
      .populate("author")
      .populate("category");

    res.status(200).json(userBookmarkedArticles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting bookmarks" });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-auth0Id -bookmarkedIds");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting user" });
  }
};

export default {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser,
  addBookmark,
  removeBookmark,
  getBookmarks,
  getUser,
};
