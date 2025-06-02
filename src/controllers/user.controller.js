import dotenv from "dotenv";
dotenv.config();

import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ExpressError } from "../util/ExpressError.js";
import { createSecretToken } from "../util/SecreteToken.js";
import { wrapAsync } from "../util/wrapAsync.js";

const signup = wrapAsync(async (req, res) => {
  const { name: username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ExpressError(400, "User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  const token = createSecretToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });

  res.status(201).json({
    message: "Welcome to Apna Video Call!",
    success: true,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

const login = wrapAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ExpressError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ExpressError(400, "Incorrect email! please enter correct email.");
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    throw new ExpressError(
      400,
      "Incorrect password! please enter correct password."
    );
  }

  const token = createSecretToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax", // ✅ allow cross-origin on Render
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 day
  });

  res.status(201).json({
    message: "Welcome back to Apna Video Call",
    success: true,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

const logout = wrapAsync((req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
  });

  res.status(200).json({ message: "Logged out successfully", success: true });
});

export { signup, login, logout };
