import express from "express";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import postRouter from "./routes/postRoute.js";
import dotenv from "dotenv";
import cors from "cors";
import mediaRouter from "./routes/media.js";
import conversationRouter from "./routes/conversationRoute.js";
import jobsRouter from "./routes/jobsRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import adminRouter from "./routes/adminRoute.js";
import reportRouter from "./routes/reportRoute.js";
import userRouter from "./routes/userRoute.js";

dotenv.config();
const app = express();
if (process.env.NODE_ENV == "development") {
    app.use(
        cors({ origin: ["http://localhost:5173", "http://localhost:5174"] })
    );
}
app.use(express.json());
app.use("/api/user", authRouter);
app.use("/api/user", userRouter);
app.use("/api/media", mediaRouter);
app.use("/api/post", postRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reports", reportRouter);
if (process.env.NODE_ENV == "production") {
    app.use(express.static("../client/dist"));
}
const PORT = process.env.PORT || 5001;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
