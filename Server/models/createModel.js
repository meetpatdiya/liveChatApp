import db from "../config/db.js"
export const createConversation = async(user_id,privacy,type,grp_name,grp_avtar)=>{
    const q = `Insert into conversations(privacy,type,created_by,group_name,group_avatar) values(?,?,?,?,?)`;
    const [crtconvr] = await db.promise().query(q,[privacy,type,user_id,grp_name,grp_avtar]);
    return crtconvr.insertId;
}

export const addMembers = async(cnv_id,user_id)=>{
    const q = `Insert into conversation_members(conversation_id,user_id) values(?,?)`;
    const [addMembers] = await db.promise().query(q,[cnv_id,user_id]);
    return addMembers;
}