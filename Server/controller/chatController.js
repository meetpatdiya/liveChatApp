import {
  getGroupName,
  getMessages,
  getGroupInfo,
  sendMessage,
  insertMessInfo,
  getLastSeen
} from "../models/chatmodel.js";
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
  const userId = req.user.id
  try {
    const messages = await getMessages(id);
    const grpinfo = await getGroupInfo(id);
    const lsnSeen = await getLastSeen(id,userId);
    if (messages.length == 0) {
      return res.status(200).json({messag:"start chatting" });
    }
    return res.status(200).json({ messages, grpinfo,lsnSeen });
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
    const messInfo = await insertMessInfo(msg_id, "sent", cnv_id,snd_id);
    if (!messInfo)
      return res
        .status(400)
        .json({ message: "Erro while inserting into messages status table" });
          const io = req.app.get("io");

   io.emit("newMessage", {
      conversation_id:req.body.cnv_id,
      sender_id:req.body.snd_id,
      message:req.body.msg,
      created_at:new Date()
   });
    return res.status(200).json({ message: "Message Sent Successfully" });
  } catch (error) {
    console.log(error);
     return res.status(500).json({ message: "server error" });
  }
};
