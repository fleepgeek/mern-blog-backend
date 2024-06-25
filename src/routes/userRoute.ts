import { Router } from "express";
import MyUserController from "../controllers/userController";
import { jwtCheck } from "../middlewares/auth";

const router = Router();

router.post("/", jwtCheck, MyUserController.createCurrentUser);

export default router;
