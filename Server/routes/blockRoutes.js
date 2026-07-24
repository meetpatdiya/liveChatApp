import express from "express"
const router = express.Router();
import { blockTheUser } from "../controller/blockController.js";
router.post("/",blockTheUser)
export default router;