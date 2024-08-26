import { Router } from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtValidate } from "../middlewares/auth";
import { validateMyUserRequest } from "../middlewares/validation";
import { body } from "express-validator";

const router = Router();

router.get("/", jwtCheck, jwtValidate, MyUserController.getCurrentUser);

router.post("/", jwtCheck, MyUserController.createCurrentUser);

router.put(
  "/",
  jwtCheck,
  jwtValidate,
  validateMyUserRequest,
  MyUserController.updateCurrentUser
);

router.post("/bookmarks", jwtCheck, jwtValidate, MyUserController.addBookmark);
router.get("/bookmarks", jwtCheck, jwtValidate, MyUserController.getBookmarks);
router.delete(
  "/bookmarks/:id",
  jwtCheck,
  jwtValidate,
  MyUserController.removeBookmark
);

export default router;
