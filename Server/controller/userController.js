import cloudinary from "../config/cloudinaryConfig.js";
import { saveProfilePicture } from "../models/userModel.js";
import fs from "fs"
export const updateProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "profile_pictures",
      }
    );
    fs.unlinkSync(req.file.path);
    await saveProfilePicture(id, result.secure_url);
    res.status(200).json({
      success: true,
      profile_picture: result.secure_url,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};