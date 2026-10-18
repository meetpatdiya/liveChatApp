import IORedis from "ioredis"
const redisConnection = new IORedis({
    host:"127.0.0.1",
    port:6379,
    maxRetriesPerRequest:null,
})
redisConnection.on("error",(err)=>console.log("Redis Error:",err))
redisConnection.on("connect",()=>console.log("Redis Connected"))
export default redisConnection