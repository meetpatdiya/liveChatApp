import express from "express"
import { insertConversation,insertGroup,insertGroupMembers,checkMem } from "../controller/createController.js";
const router = express.Router()
router.post("/insertdirect",insertConversation)
router.post("/insertgroup",insertGroup)
router.post("/insertgrpmembers",insertGroupMembers)
router.get("/checkMembers/:name/:cnv_id",checkMem)
export default router