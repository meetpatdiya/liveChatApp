import mysql,{createPool} from "mysql2"
import dotenv from "dotenv"
dotenv.config()
const db =  mysql.createPool({
    host:process.env.MYSQLHOST,
    user:process.env.MYSQLUSER,
    database:process.env.MYSQL_DATABASE,
    password:process.env.MYSQL_PASSWORD,
})
export default db
