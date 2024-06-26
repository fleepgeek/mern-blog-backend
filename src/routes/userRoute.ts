import { Router } from "express";
import MyUserController from "../controllers/userController";
import { jwtCheck, jwtValidate } from "../middlewares/auth";
import { validateMyUserRequest } from "../middlewares/validation";

const router = Router();

router.post("/", jwtCheck, MyUserController.createCurrentUser);
router.get("/", jwtCheck, jwtValidate, MyUserController.getCurrentUser);
router.put(
  "/",
  jwtCheck,
  jwtValidate,
  validateMyUserRequest,
  MyUserController.updateCurrentUser
);

export default router;
