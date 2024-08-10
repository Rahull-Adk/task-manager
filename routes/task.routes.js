import {Router} from "express";
import {createTask, deleteTask, editTask} from "../controllers/task.controllers.js";
import {secureRoutes} from "../middlewares/secureRoutes.js";

const router = Router();

router.post("/newTask", secureRoutes, createTask);
router.delete("/deleteTask/:id", secureRoutes, deleteTask);
router.put("/editTask/:id", secureRoutes, editTask);

export default router;