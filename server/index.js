import express from "express";
import { connectDB } from "./config/db";
import userRouter from "./routes/userRoute.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/user", userRouter);

connectDB().then(() => {
    app.listen(8080);
});
