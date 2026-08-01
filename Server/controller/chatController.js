import {
  getGroupName,
  getMessages,
  getGroupInfo,
  sendMessage,
  insertMessInfo,
  getLastSeen,
  updateGroup,
  getGroupMembers,
  clearChat,
} from "../models/chatmodel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import AppError from "../middleware/appError.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getGroups = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const data = await getGroupName(id);
  if (data.length == 0) {
    throw new AppError("conversation does not exists", 200);
  }
  return res.status(200).json(data);
});

export const getMessage = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;
  if (!id) throw new AppError("user id is required", 400);
  const messages = await getMessages(id,userId);
  const grpinfo = await getGroupInfo(userId,id);
  const lsnSeen = await getLastSeen(id, userId);
  if (messages.length == 0) {
    return res.status(200).json({ messag: "start chatting", grpinfo });
  }
  return res.status(200).json({ messages, grpinfo, lsnSeen,isBlocked:req.isBlocked,blockedByMe:req.blockedByMe });
});

export const sendMessageto = asyncHandler(async (req, res) => {
  const { cnv_id, snd_id, msg, msg_type } = req.body;
  if (!cnv_id || !snd_id || !msg || !msg_type)
    throw new AppError("please provide details", 400);

  const msg_id = await sendMessage(cnv_id, snd_id, msg, msg_type);
 
  if (!msg_id) throw new AppError("error while inserting message", 400);
  const messInfo = await insertMessInfo(msg_id, "sent", cnv_id, snd_id);

  if (!messInfo)
    throw new AppError("error while inserting int messaege status", 400);
  const io = req.app.get("io");

  io.emit(`newMessage_${cnv_id}`, {
    conversation_id: cnv_id,
    sender_id: snd_id,
    message: msg,
    message_type: msg_type,
    created_at: new Date(),
  });
  io.emit('newMessage',{
     conversation_id: cnv_id,
  })
  console.log("hey i gets executed")
  return res.status(200).json({ message: "Message Sent Successfully" });
});

export const sendImageto = asyncHandler(async (req, res) => {
  const { cnv_id, snd_id, msg_type } = req.body;
  if (!cnv_id || !snd_id || !msg_type || !req.file)
    throw new AppError("please provide details", 400);
  const folderName = msg_type == "image" ? "chatImages" : "chatFiles";
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: folderName,
    resource_type: "auto",
    use_filename: true,
    filename_override: req.file.originalname,
  });
  const msg_id = await sendMessage(cnv_id, snd_id, result.secure_url, msg_type);
  if (!msg_id) throw new AppError("error while inserting into message id", 400);
  const messInfo = await insertMessInfo(msg_id, "sent", cnv_id, snd_id);
  if (!messInfo)
    return res
      .status(400)
      .json({ message: "Erro while inserting into messages status table" });
  const io = req.app.get("io");
  io.emit("newMessage", {
    conversation_id: cnv_id,
    sender_id: snd_id,
    message: result.secure_url,
    created_at: new Date(),
  });
  return res
    .status(200)
    .json({ message: "Message Sent Successfully", image: result.secure_url });
});

export const updateGroupInfo = asyncHandler(async (req, res) => {
  const { grp_id, grp_name } = req.body;

  if (!grp_id) {
    throw new AppError("please provide group id", 400);
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "profile_pictures",
    resource_type: "auto",
    use_filename: true,
    filename_override: req.file.originalname,
  });

  const data = await updateGroup(grp_id, result.secure_url, grp_name);
  if (!data) throw new AppError("error while updating group info", 400);

  return res
    .status(200)
    .json({ success: true, message: "group updated successfully" });
});

export const getGroupMem = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  if(!id)  throw new AppError("please provide group id", 400);
  const result = await getGroupMembers(id);
  res.status(200).json({success:true,result});
})

export const clearChats = asyncHandler(async(req,res)=>{
  const userId = req.user.id;
  const {cnv_id} = req.body;
  if(!cnv_id) throw new AppError("conversation_id is not defined",400);
  const result = await clearChat(cnv_id,userId);
  res.status(200).json({success:true,result})
})