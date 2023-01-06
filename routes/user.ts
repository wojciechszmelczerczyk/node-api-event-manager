import { Router } from "express";
import { register, login, refreshToken } from "../controllers/UserController";
import verifyRefreshToken from "../middleware/verifyRefreshToken";

const router: Router = Router();

router.post("/", register);

router.post("/authenticate", login);

router.get("/refreshToken", verifyRefreshToken, refreshToken);

export default router;
