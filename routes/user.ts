import { Router } from "express";
import { register } from "../controllers/UserController";
import { body } from "express-validator";
const router: Router = Router();

router.post(
  "/",
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  register
);

export default router;
