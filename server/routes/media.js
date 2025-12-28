import { Router } from "express";
import cloudinary from "../config/cloudinary.js";

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
  const signature = cloudinary.v2.utils.api_sign_request(
    params, process.env.CLOUD_API_SECRET
  );
  res.json({
    signature, apiKey: process.env.CLOUD_API_KEY, cloudName: process.env.CLOUD_NAME,
    params
  })
});

export default router;
