import { User } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "invalid email" });
    const token = generateToken(user);
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(404).json({ error: "invalid credentials" });
    res.status(200).json({ token, email: user.email, _id: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist)
      return res.status(404).json({ error: "email must be unique" });
    const user = await User.create({ email, password, username: email });
    const token = generateToken(user);
    res.status(200).json({ token, email: user.email, _id: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};
