import mongoose from "mongoose";
import { mongoId, mongoString } from "../types/mongooseTypes";

const AgentSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoId,
      required: true,
    },
    context: {
      type: mongoString,
      required: true,
    },
    description: {
      type: mongoString,
      required: false,
    },
    agentName: {
      type: mongoString,
      required: true,
    },
    agentPic: {
      type: mongoString,
      required: false,
    },
    trainingFiles: [
      {
        type: mongoString,
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Agent = mongoose.model("Agent", AgentSchema);
