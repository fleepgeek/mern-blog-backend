import { Router } from "express";
import { jwtCheck, jwtValidate } from "../middlewares/auth";
import ArticleController from "../controllers/ArticleController";
import { upload } from "../middlewares/upload";
import {
  validateArticleRequest,
  validateArticleSearchRequest,
} from "../middlewares/validation";

const router = Router();

router.post(
  "/",
  upload.single("imageFile"),
  jwtCheck,
  jwtValidate,
  validateArticleRequest,
  ArticleController.createArticle
);

router.get(
  "/me",
  jwtCheck,
  jwtValidate,
  ArticleController.getCurrentUserArticles
);

router.get("/categories", ArticleController.getAllCategories);
router.get("/", ArticleController.getArticles);
router.get(
  "/search",
  validateArticleSearchRequest,
  ArticleController.searchArticles
);
router.get("/category/:id", ArticleController.getArticlesByCategory);
router.get("/user/:id", ArticleController.getArticlesByUser);
router.get("/:id", ArticleController.getSingleArticle);

router.put(
  "/:id",
  upload.single("imageFile"),
  jwtCheck,
  jwtValidate,
  validateArticleRequest,
  ArticleController.updateArticle
);

router.delete("/:id", jwtCheck, jwtValidate, ArticleController.deleteArticle);

// Re-route into comment router
import commentRoutes from "./commentRoute";
router.use("/:articleId/comments", commentRoutes);

export default router;
