import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { connectDB } from "./config/db.js";
import adminRouter from "./routes/adminRoute.js";
import authRouter from "./routes/authRoute.js";
import conversationRouter from "./routes/conversationRoute.js";
import jobsRouter from "./routes/jobsRoute.js";
import mediaRouter from "./routes/media.js";
import notificationRouter from "./routes/notificationRoute.js";
import postRouter from "./routes/postRoute.js";
import reportRouter from "./routes/reportRoute.js";
import userRouter from "./routes/userRoute.js";
import searchRouter from "./routes/searchRoute.js";

dotenv.config();
const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

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
app.use("/api/search", searchRouter);

import { fileURLToPath } from "url";

if (process.env.NODE_ENV === "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const distPath = path.join(__dirname, "../client/dist");

    app.use(express.static(distPath));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running Successfully");
    });
}

const PORT = process.env.PORT || 5001;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });
