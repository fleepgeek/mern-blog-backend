import { Router } from "express";
import commentController from "../controllers/commentController";
import { jwtCheck, jwtValidate } from "../middlewares/auth";
import { validateCommentRequest } from "../middlewares/validation";

// const router = Router();
const router = Router({ mergeParams: true });

router.get("/", commentController.getArticleComments);

router.post(
  "/",
  jwtCheck,
  jwtValidate,
  validateCommentRequest,
  commentController.postComment
);

router.patch(
  "/:commentId",
  jwtCheck,
  jwtValidate,
  validateCommentRequest,
  commentController.updateUserComment
);

router.delete(
  "/:commentId",
  jwtCheck,
  jwtValidate,
  commentController.deleteUserComment
);

export default router;
