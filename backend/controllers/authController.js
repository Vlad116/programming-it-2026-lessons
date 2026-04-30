import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { findUserByEmail, createUser } from "../repositories/index.js";
import { JWT_SECRET, JWT_EXPIRES } from "../constants.js";

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ error: "email и password обязательны!" });
  }

  const existing = findUserByEmail(email);

  if (existing) {
    return res.status(400).json({ error: "Данный Email уже зарегистрирован" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = createUser(email, hashed);
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });

  res.status(201).json({ success: true, token, user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Данный email не зарегистрирован!" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: "Неверный пароль!" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });

  res.json({
    success: true,
    token,
    user: { id: user.id, email: user.email },
  });
};

export const getUserInfo = (req, res) => {
  res.json({ user: req.user });
};
