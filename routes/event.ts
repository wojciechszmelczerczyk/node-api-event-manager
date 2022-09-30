import { Router } from "express";
import { createEvent, getEvents } from "../controllers/EventController";
const router: Router = Router();

router.get("/", getEvents);

router.post("/create", createEvent);

export default router;
