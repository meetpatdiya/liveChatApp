import { CreateUser, CheckUser } from "../models/userModel.js";
import bcrypt from "bcrypt";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide credentials" });
  }
  if (!emailRegex.test(email)) {
    return res.status(401).json({ message: "Invalid Email" });
  }
  if (name.length < 3 || password.length < 7) {
    return res.status(401).json({ message: "name/password is too short" });
  }
  const bpassword = await bcrypt.hash(password, 10);
  try {
    const user = await CreateUser(name, email, bpassword);
    return res.status(200).json({ message: "User Registered" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!emailRegex.test(email)) {
    return res.status(401).json({ message: "Invalid Email formate" });
  }
  if (password.length < 7) {
    return res
      .status(401)
      .json({ message: "password should be 8 charachters long" });
  }
  const bpassword = await bcrypt.hash(password, 10);
  try {
    const result = await CheckUser(email, password);
    if (result.error)
      return res.status(401).json({
        message: result.error,
      });
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({message:"Login succesfull",id:result.id});
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
