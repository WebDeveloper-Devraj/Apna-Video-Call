import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";

import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/user.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

// Enable CORS so that your frontend can make requests
app.use(
  cors({
    origin: ["http://localhost:5173"], // Allow only frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/meetings", meetingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;

  // Mongoose validation errors should have status code = 400
  if (err.name === "ValidationError") {
    status = 400;
  }

  // Other errors
  res.status(status).send({ success: false, message });
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const PORT = process.env.PORT || 8000;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("🔥 Startup error:", error);
  }
};

start();
