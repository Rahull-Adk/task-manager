import express, {urlencoded} from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
dotenv.config({ path: "./.env" });
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json({limit: "5mb"}));
app.use(urlencoded({extended: true, limit: "5mb"}))
app.use(cors());
app.use(cookieParser())


//routes
app.use("/api/auth", authRouter);

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
