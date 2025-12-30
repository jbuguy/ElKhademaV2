import express from "express";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/authRoute.js";
import postRouter from "./routes/postRoute.js";
import dotenv from "dotenv";
import cors from "cors";
import mediaRouter from "./routes/media.js";
import conversationRouter from "./routes/conversationRoute.js";

dotenv.config();
const app = express();
if (process.env.NODE_ENV == "development") {
  app.use(cors({ origin: "http://localhost:5173" }));
}
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/media", mediaRouter);
app.use("/api/post", postRouter);
app.use("/api/conversation", conversationRouter);
if (process.env.NODE_ENV == "production") {
  app.use(express.static("../client/dist"));
}
connectDB().then(() => {
  app.listen(8080);
});  
