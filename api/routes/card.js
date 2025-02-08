import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

import { verifyToken } from "../utils/auth.js";

router.post("/create", verifyToken, async (req, res) => {
  try {
    const { userId, deckId, textForward, textBack } = req.body;

    // Verify if the deck belongs to the user
    const deck = await prisma.deck.findFirst({
      where: {
        id: parseInt(deckId),
        userId: userId,
      },
    });

    if (!deck) {
      return res
        .status(404)
        .json({ error: "Deck not found or does not belong to the user." });
    }

    // Create the card
    const card = await prisma.card.create({
      data: {
        textForward,
        textBack,
        reviewDate: new Date(),
        deckId: parseInt(deckId),
      },
    });

    res.json({
      message: "Card added successfully!",
      card,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const { userId, deckId, cardId } = req.body;

    // Verify if the deck belongs to the user
    const deck = await prisma.deck.findFirst({
      where: {
        id: parseInt(deckId),
        userId: userId,
      },
    });

    if (!deck) {
      return res
        .status(404)
        .json({ error: "Deck not found or does not belong to the user." });
    }

    // Verify if the card exists in the deck
    const card = await prisma.card.findFirst({
      where: {
        id: parseInt(cardId),
        deckId: parseInt(deckId),
      },
    });

    if (!card) {
      return res
        .status(404)
        .json({ error: "Card not found in the specified deck." });
    }

    // Delete the card
    await prisma.card.delete({
      where: {
        id: parseInt(cardId),
      },
    });

    res.json({
      message: "Card deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
