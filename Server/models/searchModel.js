import db from "../config/db.js";

export const searchUsers = async (name,id) => {
  const value = `%${name}%`
  const q = `SELECT 
    u.id,
    u.name AS username,
    u.email As email,
    u.avatar,
    c.id AS conversationId,
    (c.id IS NOT NULL) AS hasConversation
FROM users u
LEFT JOIN (
    SELECT 
        cm2.user_id,
        cm1.conversation_id
    FROM conversation_members cm1
    JOIN conversation_members cm2
        ON cm1.conversation_id = cm2.conversation_id
    JOIN conversations c
        ON c.id = cm1.conversation_id
    WHERE cm1.user_id = ?
      AND cm2.user_id != ?
      AND c.type = 'direct'
) conv
    ON u.id = conv.user_id
LEFT JOIN conversations c
    ON c.id = conv.conversation_id
WHERE (u.name LIKE ? OR u.email LIKE ?)
  AND u.id != ?; `;
  const [searchedName] =await db.promise().query(q, [id,id,value,value,id]);
  return searchedName;
};

export const searchGroups = async (name,id) => {
  const value = `%${name}%`
  const q = `SELECT
    c.*,
    CASE
        WHEN cm.user_id IS NOT NULL THEN 1
        ELSE 0
    END AS hasConversation
FROM conversations c
LEFT JOIN conversation_members cm
    ON c.id = cm.conversation_id
    AND cm.user_id = ?
WHERE c.group_name LIKE ?
  AND c.privacy = 'public'; `;
  const [searchGroup] =await db.promise().query(q, [id,value]);
  console.log(searchGroup);
    return searchGroup;
};
