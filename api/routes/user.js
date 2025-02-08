import express from "express";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const router = express.Router();
const prisma = new PrismaClient();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

import { generateToken } from "../utils/auth.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

router.post("/register", async (req, res) => {
  try {
    const { login, password, name, email } = req.body;

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if user already exists by login or email
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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        login,
        passwordHash: hashedPassword,
        name,
        email,
      },
    });

    res
      .status(201)
      .json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    // Find user by login
    const user = await prisma.user.findUnique({ where: { login } });

    if (!user) {
      return res.status(401).json({ error: "Invalid login or password" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid login or password" });
    }

    // Generate JWT Token
    const token = generateToken(user); // Pass full user object

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, login: user.login, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
