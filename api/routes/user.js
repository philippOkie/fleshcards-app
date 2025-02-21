import { Router } from "express";
const router = Router();

import "dotenv/config";
import bcrypt from "bcryptjs";

import { generateToken } from "../utils/auth.js";

import prisma from "../utils/prismaClient.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

router.post("/register", async (req, res) => {
  try {
    const { login, password, name, email } = req.body;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ login }, { email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this login or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        login,
        passwordHash: hashedPassword,
        name,
        email: email.toLowerCase(),
      },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { loginOrEmail, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ login: loginOrEmail }, { email: loginOrEmail }],
      },
    });

    if (!user)
      return res.status(401).json({ error: "Invalid login or password" });

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid login or password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, login: user.login, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
