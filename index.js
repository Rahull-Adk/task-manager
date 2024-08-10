import express, {urlencoded} from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import {fileURLToPath} from "url"
import path from "path";
import {v2 as cloudinary} from "cloudinary"
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
dotenv.config({ path: "./.env" });
const app = express();
const port = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(express.json({limit: "5mb"}));
app.use(express.static(path.join(__dirname, "public/temp")));
app.use(urlencoded({extended: true, limit: "5mb"}))
app.use(cors());
app.use(cookieParser())

//cloudinary configurations
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter)
app.use("/api/task", taskRouter)

connectDB()
  .then(
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    })
  )
  .catch((error) => {
    console.error(`Error: ${error}`);
    process.exit(1);
  });
