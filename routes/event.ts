import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  deleteEvent,
} from "../controllers/EventController";
const router: Router = Router();

router.get("/", getEvents);

router.post("/create", createEvent);

router.get("/:title", getEvent);

router.delete("/:id", deleteEvent);

export default router;
