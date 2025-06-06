import { Router } from "express";
import userController from "../controllers/userController";
import { jwtCheck, jwtValidate } from "../middlewares/auth";
import { validateMyUserRequest } from "../middlewares/validation";

const router = Router();

router.get("/me", jwtCheck, jwtValidate, userController.getCurrentUser);

router.post("/me", jwtCheck, userController.createCurrentUser);

router.put(
  "/me",
  jwtCheck,
  jwtValidate,
  validateMyUserRequest,
  userController.updateCurrentUser
);

router.post("/me/bookmarks", jwtCheck, jwtValidate, userController.addBookmark);
router.get("/me/bookmarks", jwtCheck, jwtValidate, userController.getBookmarks);
router.delete(
  "/me/bookmarks/:id",
  jwtCheck,
  jwtValidate,
  userController.removeBookmark
);

router.get("/:id", userController.getUser);

export default router;
