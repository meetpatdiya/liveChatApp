import db from "../config/db.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
export const CreateUser = async (name, email, password) => {
  const [result] = await db
    .promise()
    .query("INSERT INTO users(name,email,password) values(?,?,?)", [
      name,
      email,
      password,
    ]);
  return result;
};
export const CheckUser = async (email, password) => {    
  const [data] = await db
    .promise()
    .query("SELECT * from users where email = ?", [email]);
  if (data.length == 0) return {error:"User Not Found"}
  const isMatch = await compare(password, data[0].password);
  if (!isMatch) return {error:"Incorrect Password"}
  const user = data[0];
  const accessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" },
  );
  return {accessToken,refreshToken,id:user.id}
};
