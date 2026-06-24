import { createConversation, addMembers , checkGroupMembers } from "../models/createModel.js";

export const insertConversation = async (req, res) => {
  const { cnv_id } = req.body;
  const user_id = req.user.id;
  if (!cnv_id) {
    return res.status(400).json({ message: "cnv_id is required" });
  }
  try {
    const insertId = await createConversation(
      user_id,
      "private",
      "direct",
      null,
      null,
    );
    const addUser = await addMembers(insertId, cnv_id);
    const addAdmin = await addMembers(insertId, user_id);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error occured" });
  }
  return res.status(201).json({ message: "Inserted Successfully" });
};

export const insertGroup = async (req, res) => {
  const { privacy, name, avatar } = req.body;
  console.log(privacy, name, avatar);
  const user_id = req.user.id;
  if (!privacy || !name) {
    return res.status(400).json({ message: "privacy and name is required" });
  }
  try {
    const insertId = await createConversation(
      user_id,
      privacy,
      "group",
      name,
      avatar,
    );
    const addAdmin = await addMembers(insertId, user_id);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error occured" });
  }
  return res.status(201).json({ message: "Inserted Successfully" });
};

export const insertGroupMembers = async (req, res) => {
  const { grp_id, mem_id } = req.body;
  try {
    const addMember = await addMembers(grp_id, mem_id);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error occured" });
  }
  return res.status(201).json({ message: "Inserted Successfully" });
};
export const checkMem = async(req,res)=>{
  const {name ,cnv_id} = req.params;
  try {
    const data =await checkGroupMembers(name,cnv_id)
    return res.status(200).json({data})
  } catch (error) {
    console.log(error);
     return res.status(400).json({ message: "Error occured" });
  }
}