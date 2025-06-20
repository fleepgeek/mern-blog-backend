import { Request, Response } from "express";
import Article, { Category } from "../models/article";
import mongoose from "mongoose";
import { deleteImage, uploadImage } from "../utils/handleImage";
import Comment from "../models/comment";
import sanitizeHtml from "sanitize-html";

// Sanitization options
const sanitizeOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "p",
    "br",
    "strong",
    "em",
    "ul",
    "ol",
    "li",
    "code",
    "pre",
    "a",
    "img",
  ],
  allowedAttributes: {
    a: ["href"],
    img: ["src", "alt"],
    "*": ["class"],
  },
  allowedClasses: {
    "*": ["*"], // Allow all classes, adjust as needed
  },
};

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

const createArticle = async (req: Request, res: Response) => {
  try {
    // Sanitize the content before saving
    const sanitizedContent = sanitizeHtml(req.body.content, sanitizeOptions);
    const article = new Article({
      ...req.body,
      content: sanitizedContent,
    });
    article.author = new mongoose.Types.ObjectId(req.userId);

    if (req.file) {
      const imageUrl = await uploadImage(req.file);
      article.coverImageUrl = imageUrl;
    }

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
      .sort({ createdAt: -1 }) // Sort by creation date, most recent first
      .select("title author category createdAt coverImageUrl")
      .select({
        content: { $substr: ["$content", 0, 200] }, // First 200 characters
      })
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
      .sort({ createdAt: -1 })
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
      .sort({ createdAt: -1 })
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

    const searchQuery = (req.query.title as string) || "";
    const query: any = {};
    query["author"] = req.userId;
    query["title"] = new RegExp(searchQuery, "i");

    const sortBy = (req.query.sortBy as string) || "-1"; // Default to newest

    const filterByCategoryQuery = req.query.filterByCategory as string;
    if (filterByCategoryQuery && filterByCategoryQuery !== "all") {
      const categories = await Category.find({
        name: new RegExp(filterByCategoryQuery, "i"),
      }).select("_id");
      const categoryIds = categories.map((cat) => cat._id);
      query["category"] = { $in: categoryIds };
    }

    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = pageSize * page - pageSize;
    const articles = await Article.find(query)
      .populate("author", "name")
      .sort({ createdAt: sortBy === "newest" ? -1 : 1 }) // Sort by creation date
      .select("title")
      .limit(pageSize)
      .skip(skip)
      .lean();

    const total = await Article.countDocuments(query);

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
    article.content = sanitizeHtml(content, sanitizeOptions);

    if (req.file) {
      const imageUrl = await uploadImage(req.file);
      if (article.coverImageUrl) {
        await deleteImage(article.coverImageUrl);
      }
      article.coverImageUrl = imageUrl;
    }

    const updatedArticle = await article.save();

    res.status(200).send(updatedArticle);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update article" });
  }
};

const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found!" });
    }

    if (req.userId !== article.author.toString()) {
      return res.status(403).json({
        message: "You're only allowed to delete articles created by you.",
      });
    }

    const imageToDelete = article.coverImageUrl;
    const result = await article.deleteOne();

    if (result.deletedCount === 1) {
      if (imageToDelete) {
        await deleteImage(imageToDelete);
      }

      await Comment.deleteMany({ article: id });
    }

    res.status(200).json({ message: "Article successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete article" });
  }
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
  // uploadCoverImage,
  getArticles,
  getArticlesByCategory,
  getArticlesByUser,
  getCurrentUserArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
  searchArticles,
};
