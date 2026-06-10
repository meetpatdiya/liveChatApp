import express from "express"
import { getGroups,getMessage,sendMessageto } from "../controller/chatController.js";
const router = express.Router()
router.get("/getchat",getGroups);
router.post("/getmessages",getMessage);
router.post("/sendmessage",sendMessageto)
export default router;  