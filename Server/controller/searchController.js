import { searchUsers, searchGroups } from "../models/searchModel.js";

export const searchUser = async (req, res) => {
  const { name } = req.body;
  const id = req.user.id  
  try {
    const searchResult = await searchUsers(name,id);
    const searchResult2 = await searchGroups(name);
    return res.status(200).json({ searchResult, searchResult2 });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};
