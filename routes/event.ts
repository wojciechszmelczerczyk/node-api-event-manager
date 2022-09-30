import { Router } from "express";
import { createEvent } from "../controllers/EventController";
const router: Router = Router();

router.post("/create", createEvent);

export default router;
