import db from "../config/db.js";
const blockChecker = (fieldId) => {
  return async (req, res, next) => {
    const blockedId = req.user.id;
    const cnv_id = req.body[fieldId];
    const q2 = 'select type from conversations where id = ?';;
    const [isgroup] =await db.promise().query(q2,[cnv_id]);
    if(isgroup[0].type == 'group'){
        req.isBlocked = false;
        req.blockedByMe = false;
        return next();
    }
    const q1 =
      "select user_id from conversation_members where conversation_id = ? and user_id != ?";
    const [blckId] = await db.promise().query(q1, [cnv_id, blockedId]);
    const blockerId = blckId[0].user_id;
    const q = `select 1,blocker_id from user_blocks where (blocker_id = ? and blocked_id = ?) or (blocker_id = ? and blocked_id = ?)`;
    const [result] = await db
      .promise()
      .query(q, [blockerId, blockedId, blockedId, blockerId]);
    console.log(result)
    req.isBlocked = result.length > 0;
    req.blockedByMe = blockedId == result[0]?.blocker_id;
    next();
  };
};
export default blockChecker;
