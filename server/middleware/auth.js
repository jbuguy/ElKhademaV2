import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "authorization token required" });
  }
  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(_id).select("_id");
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
