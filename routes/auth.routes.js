import { Router } from "express";
import { login ,logout ,signUp } from "../controllers/auth.controllers.js";
import {secureRoutes} from "../middlewares/secureRoutes.js";
const router = Router();

router.post("/register", (signUp));
router.post("/login", (login))
router.post("/logout", secureRoutes, logout)

export default router;
