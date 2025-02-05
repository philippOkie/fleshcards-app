import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create", async (req, res) => {
  try {
    const { userId, name } = req.body;

    const deck = await prisma.deck.create({
      data: {
        name,
        userId: userId,
      },
    });

    res.json({
      message: "Deck created successfully",
      deckId: deck.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all", async (req, res) => {
  const decks = await prisma.deck.findMany({
    include: { cards: true },
  });
  res.json(decks);
});

export default router;
