import {
  createConversation,
  addMembers,
  checkGroupMembers,
} from "../models/createModel.js";
import AppError from "../middleware/appError.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const insertConversation = asyncHandler(async (req, res) => {
  const { cnv_id } = req.body;
  const user_id = req.user.id;
  if (!cnv_id) {
    throw new AppError("please provide conversation_id", 400);
  }
  const insertId = await createConversation(
    user_id,
    "private",
    "direct",
    null,
    null,
  );
  const addUser = await addMembers(insertId, cnv_id);
  const addAdmin = await addMembers(insertId, user_id);
  return res.status(201).json({ message: "Inserted Successfully" });
});

export const insertGroup = asyncHandler(async (req, res) => {
  const { privacy, name, avatar } = req.body;
  console.log(privacy, name, avatar);
  const user_id = req.user.id;
  if (!privacy || !name) {
    throw new AppError("provide name and privacy detial", 400);
  }
  const insertId = await createConversation(
    user_id,
    privacy,
    "group",
    name,
    avatar,
  );
  const addAdmin = await addMembers(insertId, user_id);

  return res.status(201).json({ message: "Inserted Successfully" });
});

export const insertGroupMembers = asyncHandler(async (req, res) => {
  const { grp_id, mem_id } = req.body;
  if (!grp_id || !mem_id) {
    throw new AppError("provide group id  and user id", 400);
  }
  const addMember = await addMembers(grp_id, mem_id);
  return res.status(201).json({ message: "Inserted Successfully" });
});
export const checkMem = asyncHandler(async (req, res) => {
  const { name, cnv_id } = req.params;
  if (!name || !cnv_id) {
    throw new AppError("provide name and converation id", 400);
  }
  const data = await checkGroupMembers(name, cnv_id);
  return res.status(200).json({ data });
});
