import { Router } from "express";
import { jwtCheck, jwtValidate } from "../middlewares/auth";
import articleController from "../controllers/articleController";
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
  articleController.createArticle
);

router.get(
  "/me",
  jwtCheck,
  jwtValidate,
  articleController.getCurrentUserArticles
);

router.get("/categories", articleController.getAllCategories);
router.get("/", articleController.getArticles);
router.get(
  "/search",
  validateArticleSearchRequest,
  articleController.searchArticles
);
router.get("/category/:id", articleController.getArticlesByCategory);
router.get("/user/:id", articleController.getArticlesByUser);
router.get("/:id", articleController.getSingleArticle);

router.put(
  "/:id",
  upload.single("imageFile"),
  jwtCheck,
  jwtValidate,
  validateArticleRequest,
  articleController.updateArticle
);

router.delete("/:id", jwtCheck, jwtValidate, articleController.deleteArticle);

// Re-route into comment router
import commentRoutes from "./commentRoute";
router.use("/:articleId/comments", commentRoutes);

export default router;
