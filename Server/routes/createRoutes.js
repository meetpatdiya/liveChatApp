import express from "express"
import { insertConversation } from "../controller/createController.js";
const router = express.Router()
router.post("/insertdirect",insertConversation)
export default router