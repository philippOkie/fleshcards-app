import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create", async (req, res) => {
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

export default router;
