import { Router } from "express";
import cloudinary from "../config/cloudinary.js";
import { google } from "googleapis";
import multer from "multer";
import stream from "stream";
import path from "path";
import { fileURLToPath } from "url";
const router = Router();

router.post("/signature", (req, res) => {
    const { type } = req.body;
    let params = { timestamp: Math.floor(Date.now() / 1000) };
    if (type == "post") {
        params.folder = "posts";
    }

    if (type == "avatar") {
        params.folder = "avatars";
    }
    console.log("PARAMS FROM BACKEND:", params);
    const signature = cloudinary.v2.utils.api_sign_request(
        params,
        process.env.CLOUD_API_SECRET
    );
    res.json({
        signature,
        apiKey: process.env.CLOUD_API_KEY,
        cloudName: process.env.CLOUD_NAME,
        params,
    });
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
});
const KEY_FILE_PATH = path.join(__dirname, "../pdfhandler.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const UPLOAD_FOLDER_ID = "0ACI8KI7VpFzhUk9PVA";
const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
});
const drive = google.drive({ version: "v3", auth });
router.post("/pdf", upload.single("pdf"), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ error: "No file uploaded" });

        const fileMetadata = {
            name: `${Date.now()}_${req.file.originalname}`,
            parents: [UPLOAD_FOLDER_ID],
        };

        const media = {
            mimeType: req.file.mimetype,
            body: stream.Readable.from(req.file.buffer),
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id",
            supportsAllDrives: true,
        });

        console.log("Uploaded File ID:", file.data.id);
        res.json({
            success: true,
            fileId: file.data.id,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: error.message });
    }
});
router.get("/pdf/:fileId", async (req, res) => {
    try {
        const fileId = req.params.fileId;

        const fileInfo = await drive.files.get({
            fileId: fileId,
            fields: "name, mimeType",
            supportsAllDrives: true,
        });

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileInfo.data.name}"`
        );
        res.setHeader("Content-Type", fileInfo.data.mimeType);

        const result = await drive.files.get(
            { fileId: fileId, alt: "media", supportsAllDrives: true },
            { responseType: "stream" }
        );

        result.data.pipe(res);
    } catch (error) {
        console.error("Download Error:", error);
        res.status(404).json({ error: error.message });
    }
});
export default router;
