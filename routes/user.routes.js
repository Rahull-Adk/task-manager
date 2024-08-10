import {Router} from "express"
import {updateUser, getUserProfile} from "../controllers/user.controllers.js";
import {secureRoutes} from "../middlewares/secureRoutes.js";
import {upload} from "../middlewares/multer.js";

const router = Router()

router.put("/update/:id", secureRoutes, upload.single("avatar"), updateUser);
router.get("/profile/:username", secureRoutes, getUserProfile);

export default router;