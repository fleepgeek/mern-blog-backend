import { Request, Response } from "express";
import Comment from "../models/comment";
import Article from "../models/article";
import { ObjectId } from "mongodb";

const getArticleComments = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const comments = await Comment.find({ article }).populate("user");

    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get article comments" });
  }
};

const postComment = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const comment = new Comment();
    comment.user = new ObjectId(req.userId);
    comment.article = article._id;
    comment.content = content;

    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to post comment" });
  }
};

const updateUserComment = async (req: Request, res: Response) => {
  try {
    const { articleId, commentId } = req.params;
    const { content } = req.body;
    const article = await Article.findById(articleId);
    const comment = await Comment.findById(commentId);

    if (!article || !comment) {
      return res.status(404).json({ message: "Article or Comment not found" });
    }

    if (comment.user.toString() !== req.userId) {
      return res.status(401).json({
        message: "Unauthorized: You can only update comment you created.",
      });
    }

    comment.content = content;

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update comment" });
  }
};

const deleteUserComment = async (req: Request, res: Response) => {
  try {
    const { articleId, commentId } = req.params;
    const article = await Article.findById(articleId);
    const comment = await Comment.findById(commentId);

    if (!article || !comment) {
      return res.status(404).json({ message: "Article or Comment not found" });
    }

    if (comment.user.toString() !== req.userId) {
      return res.status(401).json({
        message: "Unauthorized: You can only delete comment you created.",
      });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

export default {
  getArticleComments,
  postComment,
  updateUserComment,
  deleteUserComment,
};
