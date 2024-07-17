import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import Article, { Category } from "../models/article";
import mongoose from "mongoose";

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

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = image.buffer.toString("base64");
  const imageDataURI = `data:${image.mimetype};base64,${base64Image}`;

  const response = await cloudinary.uploader.upload(imageDataURI);
  return response.url;
};

export default { createArticle, getAllCategories, uploadCoverImage };
