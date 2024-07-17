import { Router } from "express";
import { jwtCheck, jwtValidate } from "../middlewares/auth";
import articleController from "../controllers/articleController";
import { upload } from "../middlewares/upload";
import multer from "multer";

const router = Router();

router.post("/", jwtCheck, jwtValidate, articleController.createArticle);

router.post(
  "/upload-image",
  upload.single("imageFile"),
  jwtCheck,
  jwtValidate,
  articleController.uploadCoverImage
);

router.get("/categories", articleController.getAllCategories);

export default router;
