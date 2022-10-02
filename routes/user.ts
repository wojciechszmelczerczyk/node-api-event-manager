import { Router } from "express";
import { register, login, refreshToken } from "../controllers/UserController";
const router: Router = Router();

router.post("/", register);

router.post("/authenticate", login);

router.get("/refreshToken", refreshToken);

export default router;
