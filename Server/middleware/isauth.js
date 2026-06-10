import jwt from "jsonwebtoken"
export default function isauth(req, res, next) {
const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Token does not exist" });
  }
  jwt.verify(token, process.env.ACCESS_SECRET, (err, data) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = data;
    next();
  });
}