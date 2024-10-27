import { Router } from "express";
import {
  chatWIthAIAgent,
  createAgent,
  CreateAiBlog,
  EditAIAgent,
  getListOfAllAgents,
} from "../controllers/ai.controller";
import upload from "../middlewares/multerConfig";
import { authCheckMiddleware } from "../middlewares/authCheck";

const router = Router();

router.post(
  "/create-agent",
  authCheckMiddleware,
  upload.fields([
    { name: "agentPic", maxCount: 1 },
    { name: "trainFiles", maxCount: 10 },
  ]),
  createAgent
);
router.get("/get-all-user-agents", authCheckMiddleware, getListOfAllAgents);
router.post("/chat/:agentId/:chatId?", authCheckMiddleware, chatWIthAIAgent);
router.put(
  "/edit-agent/:agentId",
  upload.fields([{ name: "agentPic", maxCount: 1 }]),
  authCheckMiddleware,
  EditAIAgent
);
router.post("/create-blog", CreateAiBlog);

export default router;
