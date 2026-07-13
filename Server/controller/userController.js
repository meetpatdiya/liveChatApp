import cloudinary from "../config/cloudinaryConfig.js";
import { saveProfilePicture } from "../models/userModel.js";
import AppError from "../middleware/appError.js";
import asyncHandler from "../middleware/asyncHandler.js";
import fs from "fs";
export const updateProfilePicture = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    throw new AppError("please provide file", 400);
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "profile_pictures",
  });
  fs.unlinkSync(req.file.path);
  await saveProfilePicture(id, result.secure_url);
  res.status(200).json({
    success: true,
    profile_picture: result.secure_url,
  });
});
