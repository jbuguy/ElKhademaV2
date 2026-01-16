import { Router } from "express";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

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
    const signature = cloudinary.utils.api_sign_request(
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
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/pdf", upload.single("pdf"), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ error: "No file uploaded" });

        // Upload to Cloudinary with raw resource type for PDFs
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "job_applications",
                    public_id: `${Date.now()}_${req.file.originalname}`,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const result = await uploadPromise;
        
        console.log("Uploaded File to Cloudinary:", result.public_id);
        res.json({
            success: true,
            fileId: result.public_id,
            url: result.secure_url,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/pdf/:fileId", async (req, res) => {
    try {
        const fileId = req.params.fileId.replace(/-/g, "/"); // Convert back from URL-safe format
        
        // Generate Cloudinary URL for raw files
        const url = cloudinary.url(fileId, {
            resource_type: "raw",
            secure: true,
        });

        // Redirect to Cloudinary URL
        res.redirect(url);
    } catch (error) {
        console.error("Download Error:", error);
        res.status(404).json({ error: error.message });
    }
});
export default router;
