import { Router } from "express";
import { register, login } from "../controllers/UserController";
const router: Router = Router();

router.post("/", register);

router.post("/authenticate", login);

export default router;
