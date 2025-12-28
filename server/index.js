import express from "express";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/authRoute.js";
import postRouter from "./routes/postRoute.js";
import dotenv from "dotenv";
import cors from "cors";
import mediaRouter from "./routes/media.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/media", mediaRouter);
app.use("/api/post", postRouter);

connectDB().then(() => {
  app.listen(8080);
});
