import express from "express";
import { connectDB } from "./config/db";
import userRouter from "./routes/userRoute.js";
import postRouter from "./routes/postRoute.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

connectDB().then(() => {
    app.listen(8080);
});
