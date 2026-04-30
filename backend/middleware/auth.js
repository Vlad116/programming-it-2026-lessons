import { error } from "console";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Токен не передан" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Токен недействителен или истек" });
  }
};
