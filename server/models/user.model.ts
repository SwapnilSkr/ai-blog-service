import mongoose from "mongoose";
import { mongoString } from "../types/mongooseTypes";

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: mongoString,
      required: false,
      default: "",
    },
    email: {
      type: mongoString,
      required: true,
      unique: true,
    },
    displayName: mongoString,
    password: {
      type: mongoString,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", UserSchema);
