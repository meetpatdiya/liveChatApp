import db from "../config/db.js";

export const saveProfilePicture = async (userId,imageUrl) => {
  const q ="UPDATE users SET avatar = ? WHERE id = ?";
  const [data] = await db.promise().query(q, [imageUrl, userId]);
  return data;
};
