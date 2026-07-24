import express from "express"
import { getGroups,getMessage,sendMessageto,sendImageto,updateGroupInfo,getGroupMem,clearChats } from "../controller/chatController.js";
import blockChecker from "../middleware/blockChecker.js";
import upload from "../config/multerConfig.js";
const router = express.Router() 
router.get("/getchat",getGroups);
router.post("/getmessages",blockChecker("id"),getMessage);
router.post("/sendmessage",blockChecker("cnv_id"),sendMessageto)
router.post("/clearchat",clearChats);
router.get("/getgroupmembers/:id",getGroupMem)
router.post("/sendimages",blockChecker,upload.single("imgchat"),sendImageto)
router.post("/updateGroup",upload.single("grp_avatar"),updateGroupInfo)
export default router;   