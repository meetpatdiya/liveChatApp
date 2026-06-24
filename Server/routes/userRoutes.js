import express from "express"
import upload from "../config/multerConfig.js";
import { updateProfilePicture } from "../controller/userController.js";

const router = express.Router();

router.post("/profile-picture/:id",upload.single("profile"),updateProfilePicture);
export default router;
  