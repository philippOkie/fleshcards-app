import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

import { verifyToken } from "../utils/auth.js";

router.get("/deck/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const user = req.user.id;

  try {
    if (!user) {
      return res.status(400).json({ message: "user is required" });
    }

    const deck = await prisma.deck.findUnique({
      where: { id: parseInt(id) },
      include: { cards: true },
    });

    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    if (deck.userId !== user.id) {
      return res
        .status(403)
        .json({ message: "You do not have permission to view this deck" });
    }

    const { userId: removedUserId, ...deckWithoutUserId } = deck;

    res.json(deckWithoutUserId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const user = req.user.id;

    const existingDeck = await prisma.deck.findFirst({
      where: { userId: user.id, finished: false },
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
        userId: user.id,
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

router.get("/get-unfinished-deck", verifyToken, async (req, res) => {
  const user = req.user.id;

  const unfinishedDeck = await prisma.deck.findFirst({
    where: { userId: user.id, finished: false },
    include: { cards: true },
  });

  res.json(unfinishedDeck);
});

router.get("/all", verifyToken, async (req, res) => {
  try {
    const user = req.user.id;

    const decks = await prisma.deck.findMany({
      where: { userId: user.id, finished: true },
    });

    res.json(decks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch decks" });
  }
});

export default router;
