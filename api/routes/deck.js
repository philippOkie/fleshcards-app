import { Router } from "express";
const router = Router();

import prisma from "../utils/prismaClient.js";
import { v4 as uuidv4 } from "uuid";

import { verifyToken } from "../utils/auth.js";

router.get("/deck/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user.id;

    if (!user) {
      return res.status(400).json({ message: "user is required" });
    }

    const deck = await prisma.deck.findUnique({
      where: { id: id },
      include: {
        cards: {
          orderBy: {
            id: "asc",
          },
        },
      },
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

router.delete("/deck/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user.id;

    if (!user) {
      return res.status(400).json({ message: "User is required" });
    }

    const deck = await prisma.deck.findUnique({
      where: { id },
      include: { cards: true },
    });

    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    if (deck.userId !== user) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this deck" });
    }

    await prisma.card.deleteMany({
      where: { deckId: id },
    });

    await prisma.deck.delete({
      where: { id },
    });

    res.json({ message: "Deck deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:deckId", verifyToken, async (req, res) => {
  try {
    const { deckId } = req.params;
    const updateData = req.body;
    console.log("Update data received:", updateData);

    const userId = req.user.id?.id || req.user.id;

    const deck = await prisma.deck.findFirst({
      where: { id: deckId, userId: userId },
    });

    if (!deck) {
      return res
        .status(404)
        .json({ message: "Deck not found or unauthorized" });
    }

    const updatedDeck = await prisma.deck.update({
      where: { id: deckId },
      data: updateData,
    });

    res.json({
      message: "Deck updated successfully",
      updatedDeckId: updatedDeck.id,
    });
  } catch (error) {
    console.error("Error updating deck:", error);
    res.status(500).json({
      error: error.message || "Failed to update deck",
    });
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
        id: uuidv4(),
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
  });

  res.json(unfinishedDeck);
});

router.put("/set-finished-deck/:deckId", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { deckId } = req.params;

  try {
    const deck = await prisma.deck.findUnique({
      where: { id: deckId, userId },
      include: { cards: true },
    });

    if (!deck) {
      return res
        .status(404)
        .json({ message: "Deck not found or does not belong to you." });
    }

    if (deck.cards.length === 0) {
      return res.status(400).json({
        message: "You must add at least one card to finish the deck.",
      });
    }

    const hasEmptyCard = deck.cards.some(
      (card) => !card.text || card.text.trim() === ""
    );
    if (hasEmptyCard) {
      return res
        .status(400)
        .json({ message: "All cards must have non-empty text." });
    }

    const updatedDeck = await prisma.deck.update({
      where: { id: deckId },
      data: { finished: true },
    });

    res.json(updatedDeck);
  } catch (error) {
    console.error("Error updating deck:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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
