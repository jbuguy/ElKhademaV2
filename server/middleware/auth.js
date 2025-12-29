import { User } from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.js"

export const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "authorization token required" });
  }
  const token = authorization.split(" ")[1];
  try {
    const { id } = verifyToken(token);
    req.user = await User.findById(id).select("_id");
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
