import mongoose from "mongoose";
import { mongoId, mongoString } from "../types/mongooseTypes";

const ConversationSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoString,
      ref: "Agent",
      required: true,
    },
    chatId: {
      type: mongoId,
      ref: "Chat",
      required: false,
    },
    userId: {
      type: mongoId,
      ref: "User",
      required: true,
    },
    user: {
      type: mongoString,
      required: false,
    },
    system: {
      type: mongoString,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Conversation = mongoose.model("Conversation", ConversationSchema);
