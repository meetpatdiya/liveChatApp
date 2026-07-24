import db from "../config/db.js";
import { getSocketId } from "./socketManager.js";

export const getGroupName = async (id) => {
  const q = `SELECT
    c.id,
    c.type,
    c.privacy,
    CASE
        WHEN c.type = 'group' THEN c.group_name
        ELSE u.name
    END AS display_name,
    CASE
        WHEN c.type = 'group' THEN c.group_avatar
        ELSE u.avatar
    END AS display_avatar
FROM conversations c
JOIN conversation_members cm
    ON c.id = cm.conversation_id
LEFT JOIN conversation_members other_cm
    ON c.id = other_cm.conversation_id
    AND other_cm.user_id != ?
LEFT JOIN users u
    ON u.id = other_cm.user_id
WHERE cm.user_id = ?;`;
  const [data] = await db.promise().query(q, [id, id]);
  return data;
};

export const getMessages = async (id,userId) => {
  const q = `select m.*,ms.user_id,ms.status,ms.seen_at from Messages m join
    message_status ms on m.id = ms.message_id join conversation_members cm on cm.conversation_id = m.conversation_id 
    where m.conversation_id = ? AND (
        cm.cleared_at IS NULL
        OR m.created_at > cm.cleared_at
    )and cm.user_id = ? order
     by m.created_at asc`
  const [data] = await db.promise().query(q, [id,userId]);
  return data;
};

export const getLastSeen = async (id, userId) => {
  const q = `SELECT 
    u.id,
    u.is_online,
    u.last_seen
FROM conversation_members cm
INNER JOIN users u 
    ON cm.user_id = u.id
WHERE cm.conversation_id = ? and u.id != ?`;
  const [data] = await db.promise().query(q, [id, userId]);
  return data;
};

export const getGroupInfo = async (userId,id) => {
  const q = `SELECT
    c.id,
    c.type,
    c.privacy,
    c.created_by,
    CASE
        WHEN c.type = 'group' THEN c.group_name
        ELSE u.name
    END AS group_name,
    CASE 
        WHEN c.type = 'group' THEN null
        ELSE u.email
        END AS user_email,
    CASE
        WHEN c.type = 'group' THEN c.group_avatar
        ELSE u.avatar
    END AS group_avatar

FROM conversations c

LEFT JOIN conversation_members cm
    ON c.id = cm.conversation_id
    AND cm.user_id != ?      

LEFT JOIN users u
    ON u.id = cm.user_id

WHERE c.id = ?;`;
  const [data] = await db.promise().query(q, [userId,id]);
  return data;
};

export const sendMessage = async (cnv_id, snd_id, msg, msg_type) => {
  const q = `Insert into messages(conversation_id,sender_id,message,message_type) values(?,?,?,?)`;
  const [messageInfo] = await db
    .promise()
    .query(q, [cnv_id, snd_id, msg, msg_type]);
  return messageInfo.insertId;
};

export const insertMessInfo = async (msg_id, status, cnv_id, snd_id) => {
  try {
    const q1 = `SELECT user_id 
  FROM conversation_members
  WHERE conversation_id = ? and user_id != ?`;
    const [members] = await db.promise().query(q1, [cnv_id, snd_id]);
    for (const m of members) {
      const updatedStatus = getSocketId(m.user_id) ? "delivered" : "sent";
      await db.promise().query(
        `INSERT INTO message_status(message_id,user_id,status)
       VALUES(?,?,?)`,
        [msg_id, m.user_id, updatedStatus],
      );
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateGroup = async (grp_id, grp_avatar, grp_name) => {
  const q =
    "UPDATE conversations SET group_avatar = ?,group_name = ? WHERE id = ? ";
  const [data] = await db.promise().query(q, [grp_avatar, grp_name, grp_id]);
  return data;
};

export const getGroupMembers = async(cnv_id)=>{
  const q = "select u.id,u.name,u.email,u.avatar,u.is_online,u.last_seen from users u join conversation_members cm on u.id = cm.user_id where cm.conversation_id = ?;";
  const [groupUsers] = await db.promise().query(q,[cnv_id]);
  return groupUsers;
}

export const clearChat = async(cnv_id,userId)=>{
  console.log("this are the inputs",cnv_id,"hey",userId)
const q = "update conversation_members set cleared_at = now() where conversation_id = ? and user_id = ?";
const [output] = await db.promise().query(q,[cnv_id,userId]);
console.log(output,"hey")
return output;
}