import mysql,{createPool} from "mysql2"
import dotenv from "dotenv"
dotenv.config()
const db =  mysql.createPool({
    host:process.env.MYSQLHOST,
    user:process.env.MYSQLUSER,
    database:process.env.MYSQLDATABASE,
    password:process.env.MYSQLPASSWORD,
})
export default db
