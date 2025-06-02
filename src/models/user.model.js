import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Your username is required!"],
  },
  email: {
    type: String,
    required: [true, "Your email address is required!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Your password is required!"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // 🔒 only hash if modified
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = new mongoose.model("User", userSchema);

export { User };
