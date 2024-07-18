import { Request, Response } from "express";
import Article, { Category } from "../models/article";
import mongoose from "mongoose";
import uploadImage from "../utils/uploadImage";

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});
    if (!categories) {
      return res.status(404).json({ message: "Categories not found" });
    }
    res.status(200).send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed getting categories!" });
  }
};

const uploadCoverImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file missing" });
    }
    const imageUrl = await uploadImage(req.file);

    res.status(201).json(imageUrl);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

const createArticle = async (req: Request, res: Response) => {
  try {
    const article = new Article(req.body);
    article.author = new mongoose.Types.ObjectId(req.userId);

    await article.save();

    res.status(201).send(article);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed creating article!" });
  }
};

const getArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find({}).populate("author", "name");
    res.status(200).json(articles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get articles" });
  }
};

const getSingleArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    await article.populate("author", "name");
    await article.populate("category");

    res.status(200).json(article);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get article" });
  }
};

export default {
  createArticle,
  getAllCategories,
  uploadCoverImage,
  getArticles,
  getSingleArticle,
};
