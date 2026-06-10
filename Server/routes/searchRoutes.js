import express from "express";
import { searchUser } from "../controller/searchController.js";

const router = express.Router();
router.post("/searchuser", searchUser);

export default router;
