import mongoose from "mongoose";
import { Schema } from "mongoose";

const meetingSchema = new Schema({
  host: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Meeting creator
  meetingCode: { type: String, required: true, unique: true },
  title: { type: String, default: "Untitled Meeting" }, // Optional meeting name
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }], // For tracking joined users
  startedAt: { type: Date, default: new Date() },
  endedAt: { type: Date },
  chatHistory: [
    {
      sender: { type: Schema.Types.ObjectId, ref: "User" },
      message: String,
      timestamp: { type: Date, default: new Date() },
    },
  ],
});

const Meeting = new mongoose.model("Meeting", meetingSchema);

export { Meeting };
