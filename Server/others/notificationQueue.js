import {Queue} from "bullmq"
import redisConnection from "../config/redis.js"

const notificationQueue = new Queue("notificationQueue",{
    connection:redisConnection
})

export default notificationQueue
