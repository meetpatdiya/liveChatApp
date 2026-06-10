import {createConversation,addMembers} from "../models/createModel.js"
export const insertConversation = async(req,res)=>{
  const {cnv_id} = req.body;
  const user_id = req.user.id;
  if(!cnv_id) {
    return res.status(400).json({message:"cnv_id is required"})
  }
  try {
      const insertId = await createConversation(user_id,"private","direct",null,null);
      const addUser = await addMembers(insertId,cnv_id);
      const addAdmin = await addMembers(insertId,user_id);
  } catch (error) {
    console.log(error);
    return res.status(400).json({message:"Error occured"})
  }
  return res.status(201).json({message:"Inserted Successfully"})
} 