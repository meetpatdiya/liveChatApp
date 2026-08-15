import { CreateUser, CheckUser } from "../models/authModel.js";
import bcrypt from "bcrypt";
import AppError from "../middleware/appError.js";
import asyncHandler from "../middleware/asyncHandler.js";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new AppError("please provide ok ok credentials", 400);
  }
  if (!emailRegex.test(email)) {
    throw new AppError("invalid email formate", 400);
  }
  if (name.length < 3 || password.length < 7) {
    throw new AppError("name or password too short", 400);
  }
  const bpassword = await bcrypt.hash(password, 10);
  const user = await CreateUser(name, email, bpassword);
  return res.status(200).json({ message: "User Registered" });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new AppError("please provide ok ok credentials", 400);
  if (!emailRegex.test(email)) {
    throw new AppError("invalid email formate", 400);
  }
  if (password.length < 7) {
    throw new AppError("password must be 8 charachters long", 400);
  }
  const result = await CheckUser(email, password);
  if (result.error) throw new appError(result.error, 400);

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
  res.status(200).json({ message: "Login succesfull", id: result.id });
});

export const logout = asyncHandler(async (req, res) => {
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
});
