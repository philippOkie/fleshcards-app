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

router.get("/deck/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const deck = await prisma.deck.findUnique({
      where: { id: parseInt(id) },
      include: { cards: true },
    });

    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    if (deck.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to view this deck" });
    }

    res.json(deck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TODO: We will need to update it so it returns all decks which are related to the authenticated user
router.get("/all", async (req, res) => {
  const decks = await prisma.deck.findMany({});
  res.json(decks);
});

export default router;
