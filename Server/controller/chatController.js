import {
  getGroupName,
  getMessages,
  getGroupInfo,
  sendMessage,
  insertMessInfo,
  getLastSeen,
  updateGroup,
} from "../models/chatmodel.js";
import cloudinary from "../config/cloudinaryConfig.js";

export const getGroups = async (req, res) => {
  const id = req.user.id;
  try {
    const data = await getGroupName(id);
    if (data.length == 0) {
      return res.status(400).json({ message: "converstaion does not exists" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server errror" });
  }
};

export const getMessage = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;
  try {
    const messages = await getMessages(id);
    const grpinfo = await getGroupInfo(id);
    const lsnSeen = await getLastSeen(id, userId);
    if (messages.length == 0) {
      return res.status(200).json({ messag: "start chatting", grpinfo });
    }
    return res.status(200).json({ messages, grpinfo, lsnSeen });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server errror" });
  }
};

export const sendMessageto = async (req, res) => {
  const { cnv_id, snd_id, msg, msg_type } = req.body;
  if (!cnv_id || !snd_id || !msg || !msg_type)
    return res.status(400).json({ message: "insufficient data" });
  try {
    const msg_id = await sendMessage(cnv_id, snd_id, msg, msg_type);
    if (!msg_id)
      return res   
        .status(400)
        .json({ message: "Erro while inserting into messages table" });
    const messInfo = await insertMessInfo(msg_id, "sent", cnv_id, snd_id);
    if (!messInfo)
      return res
        .status(400)
        .json({ message: "Erro while inserting into messages status table" });
    const io = req.app.get("io");

    io.emit(`newMessage_${cnv_id}`, { 
      conversation_id: cnv_id,
      sender_id: snd_id,
      message: msg,
      message_type:msg_type,
      created_at: new Date(),
    });
    
    return res.status(200).json({ message: "Message Sent Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const sendImageto = async (req, res) => {
  try {
    const { cnv_id, snd_id, msg_type } = req.body;
    if (!cnv_id || !snd_id || !msg_type || !req.file)
      return res
        .status(400)
        .json({ success: false, message: "insufficient data" });
    const folderName = msg_type == "image" ? "chatImages" : "chatFiles";
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName,
      resource_type: "auto",
      use_filename: true,
      filename_override: req.file.originalname,
    });
    const msg_id = await sendMessage(
      cnv_id,
      snd_id,
      result.secure_url,
      msg_type,
    );
    if (!msg_id)
      return res
        .status(400)
        .json({ message: "Erro while inserting into messages table" });  
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateGroupInfo = async (req, res) => {
  try {
    const { grp_id, grp_name } = req.body;
    if (!grp_id) {
      return res
        .status(400)
        .json({ success: false, message: "insufficient data" });
    }
     const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures",
      resource_type: "auto",
      use_filename: true,
      filename_override: req.file.originalname,
    });
      
    const data = await updateGroup(grp_id, result.secure_url, grp_name);
    if (!data) {
      return res
        .status(400)
        .json({ message: "Erro while changing group info" });
    }
    return res
      .status(200)
      .json({ success: true, message: "group updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
