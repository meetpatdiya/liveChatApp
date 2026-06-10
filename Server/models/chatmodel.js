import db from "../config/db.js";
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
  const [data] = await db.promise().query(q, [id,id]);
  return data;  
};
export const getMessages = async (id) => {
  const q = `select m.*,ms.user_id,ms.status,ms.seen_at from Messages m join
   message_status ms on m.id = ms.message_id where m.conversation_id = ? order
    by m.created_at asc;`;
  const [data] = await db.promise().query(q, [id]);  
  return data;
};

export const getLastSeen = async (id,userId) => {  
  const q = `SELECT 
    u.id,
    u.is_online,
    u.last_seen
FROM conversation_members cm
INNER JOIN users u 
    ON cm.user_id = u.id
WHERE cm.conversation_id = ? and u.id != ?`
  const [data] = await db.promise().query(q, [id,userId]);  
  return data;
};

export const getGroupInfo = async (id) => {
  const q = `Select * from conversations where id = ?`;
  const [data] = await db.promise().query(q, [id]);
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
    const [members] = await db.promise().query(q1, [cnv_id,snd_id]);
    for (const member of members) {
      await db.promise().query(
        `INSERT INTO message_status(message_id,user_id,status)
       VALUES(?,?,?)`,
        [msg_id, member.user_id, status],
      );
    }
    return true;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

