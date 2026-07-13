import AppError from "../middleware/appError.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { searchUsers, searchGroups } from "../models/searchModel.js";
export const searchUser = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new AppError("please provide name", 400);
  const id = req.user.id;
  const searchResult = await searchUsers(name, id);
  const searchResult2 = await searchGroups(name, id);
  return res.status(200).json({ searchResult, searchResult2 });
});
