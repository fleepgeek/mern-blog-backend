import { Router } from "express";
import UserController from "../controllers/UserController";
import { jwtCheck, jwtValidate } from "../middlewares/auth";
import { validateMyUserRequest } from "../middlewares/validation";

const router = Router();

router.get("/me", jwtCheck, jwtValidate, UserController.getCurrentUser);

router.post("/me", jwtCheck, UserController.createCurrentUser);

router.put(
  "/me",
  jwtCheck,
  jwtValidate,
  validateMyUserRequest,
  UserController.updateCurrentUser
);

router.post("/me/bookmarks", jwtCheck, jwtValidate, UserController.addBookmark);
router.get("/me/bookmarks", jwtCheck, jwtValidate, UserController.getBookmarks);
router.delete(
  "/me/bookmarks/:id",
  jwtCheck,
  jwtValidate,
  UserController.removeBookmark
);

router.get("/:id", UserController.getUser);

export default router;
