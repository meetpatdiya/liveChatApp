import db from "../config/db.js";

export const getUserId = async(cnv_id,userId)=>{
    const q = `select user_id from conversation_members where conversation_id = ? and user_id != ?`;
    const result = db.promise().query(q,[cnv_id,userId]);
    return result;
}

export const blockUser = async(userId,blockId)=>{
    const q = `insert into user_blocks(blocker_id,blocked_id) values(?,?)`;
    const [result] = db.promise().query(q,[userId,blockId]);
    return result;
}