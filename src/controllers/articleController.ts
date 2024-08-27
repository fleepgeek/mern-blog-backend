import { Request, Response } from "express";
import Article, { Category } from "../models/article";
import mongoose from "mongoose";
import uploadImage from "../utils/uploadImage";
import { title } from "process";

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
    const page = parseInt(req.query.page as string) || 1;

    const pageSize = 5;
    const skip = pageSize * page - pageSize;
    // const articles = await Article.find({})
    const articles = await Article.find()
      .populate("author", "name")
      .populate("category", "name")
      .limit(pageSize)
      .skip(skip)
      .lean();

    const total = await Article.countDocuments();
    const pages = Math.ceil(total / pageSize);
    const response = {
      pagingInfo: {
        total,
        page,
        pages,
      },
      articles,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get articles" });
  }
};

const getArticlesByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const total = await Article.countDocuments({
      category: categoryId,
    });
    if (!total) {
      return res.status(404).json({
        pagingInfo: {
          total: 0,
          page: 1,
          pages: 1,
        },
        articles: [],
      });
    }

    const page = parseInt(req.query.page as string) || 1;

    const pageSize = 5;
    const skip = pageSize * page - pageSize;
    // const articles = await Article.find({})
    const articles = await Article.find({
      category: categoryId,
    })
      .populate("author", "name")
      .populate("category", "name")
      .limit(pageSize)
      .skip(skip)
      .lean();

    // const total = await Article.countDocuments();
    const pages = Math.ceil(total / pageSize);
    const response = {
      pagingInfo: {
        total,
        page,
        pages,
      },
      articles,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get articles in the category" });
  }
};

const getArticlesByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const total = await Article.countDocuments({
      author: userId,
    });
    if (!total) {
      return res.status(404).json({
        pagingInfo: {
          total: 0,
          page: 1,
          pages: 1,
        },
        articles: [],
      });
    }

    const page = parseInt(req.query.page as string) || 1;

    const pageSize = 5;
    const skip = pageSize * page - pageSize;
    // const articles = await Article.find({})
    const articles = await Article.find({
      author: userId,
    })
      .populate("author", "name")
      .populate("category", "name")
      .limit(pageSize)
      .skip(skip)
      .lean();

    // const total = await Article.countDocuments();
    const pages = Math.ceil(total / pageSize);
    const response = {
      pagingInfo: {
        total,
        page,
        pages,
      },
      articles,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get user articles" });
  }
};

const getCurrentUserArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;

    const pageSize = 5;
    const skip = pageSize * page - pageSize;
    const articles = await Article.find({ author: req.userId })
      .populate("author", "name")
      .limit(pageSize)
      .skip(skip)
      .lean();

    const total = await Article.countDocuments({ author: req.userId });

    const response = {
      pagingInfo: {
        total,
        page,
        pages: Math.ceil(total / pageSize) || 1,
      },
      articles,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get user articles" });
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

const updateArticle = async (req: Request, res: Response) => {
  try {
    const { title, category, content, coverImageUrl } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (req.userId !== article.author._id.toString()) {
      return res.status(403).json({
        message: "You're only allowed to update articles created by you.",
      });
    }

    article.title = title;
    article.category = category;
    article.content = content;
    article.coverImageUrl = coverImageUrl;

    const updatedArticle = await article.save();

    res.status(200).send(updatedArticle);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update article" });
  }
};

const deleteArticle = async (req: Request, res: Response) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({ message: "Article not found!" });
  }

  if (req.userId !== article.author.toString()) {
    return res.status(403).json({
      message: "You're only allowed to delete articles created by you.",
    });
  }

  await article.deleteOne();

  res.status(200).json({ message: "Article succesfully deleted" });
};

const searchArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const searchQuery = (req.query.searchQuery as string) || "";
    const query: any = {};

    const searchRegex = new RegExp(searchQuery, "i");
    query["$or"] = [{ title: searchRegex }, { content: searchRegex }];

    const total = await Article.countDocuments(query);

    if (!total) {
      return res.status(404).json({
        pagingInfo: {
          total: 0,
          page: 1,
          pages: 1,
        },
        articles: [],
      });
    }

    const pageSize = 5;
    const skip = pageSize * page - pageSize;

    const articles = await Article.find(query)
      .populate("author", "name")
      .populate("category", "name")
      .limit(pageSize)
      .skip(skip)
      .lean();

    const pages = Math.ceil(total / pageSize);
    const response = {
      pagingInfo: {
        total,
        page,
        pages,
      },
      articles,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to search articles" });
  }
};

export default {
  createArticle,
  getAllCategories,
  uploadCoverImage,
  getArticles,
  getArticlesByCategory,
  getArticlesByUser,
  getCurrentUserArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
  searchArticles,
};
