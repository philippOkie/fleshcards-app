import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create", async (req, res) => {
  try {
    const { userId, name } = req.body;

    const existingDeck = await prisma.deck.findFirst({
      where: { userId, finished: false },
    });

    if (existingDeck) {
      return res.json({
        message: "Unfinished deck found",
        deckId: existingDeck.id,
      });
    }

    const newDeck = await prisma.deck.create({
      data: {
        name,
        userId,
        finished: false,
      },
    });

    res.json({
      message: "Deck created successfully",
      deckId: newDeck.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-unfinished-deck", async (req, res) => {
  const { userId } = req.query;

  const unfinishedDeck = await prisma.deck.findFirst({
    where: { userId, finished: false },
    include: { cards: true },
  });

  res.json(unfinishedDeck);
});

router.get("/all", async (req, res) => {
  const decks = await prisma.deck.findMany({
    include: { cards: true },
  });
  res.json(decks);
});

export default router;
