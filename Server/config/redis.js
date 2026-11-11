import dotenv from "dotenv"
dotenv.config()
import IORedis from "ioredis"
const redisConnection = new IORedis({
    host:process.env.REDIS_HOST,
    port:Number(process.env.REDIS_PORT),
    maxRetriesPerRequest:null,
})
redisConnection.on("error",(err)=>console.log("Redis Error:",err))
redisConnection.on("connect",()=>console.log("Redis Connected"))
export default redisConnection