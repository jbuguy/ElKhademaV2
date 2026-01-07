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
import path from "path";

dotenv.config();
const app = express();

// --- 1. Middleware ---
app.use(
    cors({
        // Add your production domain to this list if necessary
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    })
);

app.use(express.json());

// --- 2. API Routes ---
app.use("/api/user", authRouter);
app.use("/api/user", userRouter);
app.use("/api/media", mediaRouter);
app.use("/api/post", postRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reports", reportRouter);

// --- 3. Frontend Static Serving ---
import { fileURLToPath } from "url"; // Add this import at the top if missing

// ... (rest of your imports)

// --- 3. Frontend Static Serving ---
if (process.env.NODE_ENV === "production") {
    // 1. Correctly define __dirname for ES Modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // 2. Point to the correct folder (Sibling folder strategy)
    // ".." moves out of 'server', then into 'client/dist'
    const distPath = path.join(__dirname, "../client/dist");

    console.log("Serving static files from:", distPath); // CHECK YOUR TERMINAL FOR THIS LOG

    // 3. Serve the static files
    app.use(express.static(distPath));

    // 4. Handle SPA routing (Using the Regex fix from before)
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running Successfully");
    });
}

const PORT = process.env.PORT || 5001;

// Only start server after DB connects
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });
