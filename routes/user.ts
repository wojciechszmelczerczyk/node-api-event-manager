import { Router } from "express";
import { register } from "../controllers/UserController";
const router: Router = Router();

router.post("/", register);

export default router;
