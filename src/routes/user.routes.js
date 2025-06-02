import { Router } from "express";
import {
  login,
  signup,
  logout
} from "../controllers/user.controller.js";

const router = Router();

// signup user
router.post("/signup", signup);

// login user
router.post("/login", login);

// logout user
router.get("/logout", logout);

export default router;
