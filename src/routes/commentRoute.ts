import { Router } from "express";
import CommentController from "../controllers/CommentController";
import { jwtCheck, jwtValidate } from "../middlewares/auth";
import { validateCommentRequest } from "../middlewares/validation";

// const router = Router();
const router = Router({ mergeParams: true });

router.get("/", CommentController.getArticleComments);

router.post(
  "/",
  jwtCheck,
  jwtValidate,
  validateCommentRequest,
  CommentController.postComment
);

router.patch(
  "/:commentId",
  jwtCheck,
  jwtValidate,
  validateCommentRequest,
  CommentController.updateUserComment
);

router.delete(
  "/:commentId",
  jwtCheck,
  jwtValidate,
  CommentController.deleteUserComment
);

export default router;
