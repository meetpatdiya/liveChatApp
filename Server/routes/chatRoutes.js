import express from "express"
import { getGroups,getMessage,sendMessageto,sendImageto,updateGroupInfo } from "../controller/chatController.js";
import upload from "../config/multerConfig.js";
const router = express.Router() 
router.get("/getchat",getGroups);
router.post("/getmessages",getMessage);
router.post("/sendmessage",sendMessageto)
router.post("/sendimages",upload.single("imgchat"),sendImageto)
router.post("/updateGroup",upload.single("grp_avatar"),updateGroupInfo)
export default router;   