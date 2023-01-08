import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  deleteEvent,
} from "../controllers/EventController";
const router: Router = Router();

router.route("/").get(getEvents).post(createEvent);

router.get("/:title", getEvent);

router.delete("/:id", deleteEvent);

export default router;
