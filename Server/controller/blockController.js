import { blockUser , getUserId} from "../models/blockModel.js"
import AppError from "../middleware/appError.js";
import asyncHandler from "../middleware/asyncHandler.js";
export const blockTheUser= asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    const {cnv_id} = req.body;
    if(!cnv_id) throw new AppError("BlockId is not defined",400);    
    const [result] = await getUserId(cnv_id,userId);
    const blockId = result[0].user_id;
    const data = await blockUser(userId,blockId);
    res.status(200).json({message:true,data})
})