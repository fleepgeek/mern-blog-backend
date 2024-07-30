import { Router } from "express";
import { jwtCheck, jwtValidate } from "../middlewares/auth";
import articleController from "../controllers/articleController";
import { upload } from "../middlewares/upload";
import { validateArticleRequest } from "../middlewares/validation";

const router = Router();

router.post(
  "/",
  jwtCheck,
  jwtValidate,
  validateArticleRequest,
  articleController.createArticle
);
router.post(
  "/upload-image",
  upload.single("imageFile"),
  jwtCheck,
  jwtValidate,
  articleController.uploadCoverImage
);

router.get("/categories", articleController.getAllCategories);
router.get("/", articleController.getArticles);
router.get("/category/:id", articleController.getArticlesByCategory);
router.get("/user/:id", articleController.getUserArticles);
router.get("/:id", articleController.getSingleArticle);

router.put(
  "/:id",
  jwtCheck,
  jwtValidate,
  validateArticleRequest,
  articleController.updateArticle
);

export default router;
