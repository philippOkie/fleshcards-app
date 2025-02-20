import express from "express";
import { PrismaClient } from "@prisma/client";

import { verifyToken } from "../utils/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/pictures", async (req, res) => {
  const query = req.query.query && req.query.query.trim();
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }
  const page = req.query.page || 1;
  const per_page = req.query.per_page || 7;
  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&page=${page}&per_page=${per_page}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Unsplash API error" });
    }

    const data = await response.json();
    const pictures = data.results.map((pic) => ({
      id: pic.id,
      urls: pic.urls.small,
      alt_description: pic.alt_description || "Unsplash Image",
    }));
    res.json({ results: pictures });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create", verifyToken, async (req, res) => {
  try {
    const user = req.user.id;
    const { deckId, textForward, textBack } = req.body;

    const deck = await prisma.deck.findFirst({
      where: {
        id: deckId,
        userId: user.id,
      },
    });

    if (!deck) {
      return res
        .status(404)
        .json({ error: "Deck not found or does not belong to the user." });
    }

    const maxCard = await prisma.card.findFirst({
      where: { deckId: deckId },
      orderBy: { id: "desc" },
    });

    const nextCardId = maxCard ? maxCard.id + 1 : 1;

    const card = await prisma.card.create({
      data: {
        id: nextCardId,
        textForward,
        textBack,
        reviewDate: new Date(),
        deckId: deckId,
      },
    });

    res.json({
      message: "Card added successfully!",
      card,
    });
  } catch (error) {
    console.error("Error adding card:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:cardId", verifyToken, async (req, res) => {
  try {
    const cardId = parseInt(req.params.cardId);
    const { deckId, ...updateFields } = req.body;

    const allowedFields = [
      "textForward",
      "textBack",
      "imageUrlForward",
      "imageUrlBack",
    ];
    const isValidUpdate = Object.keys(updateFields).some(
      (field) =>
        allowedFields.includes(field) && updateFields[field] !== undefined
    );

    if (!isValidUpdate) {
      return res.status(400).json({
        error: "At least one valid field required for update",
        validFields: allowedFields,
      });
    }

    const filteredUpdate = Object.keys(updateFields)
      .filter((field) => allowedFields.includes(field))
      .reduce((obj, field) => ({ ...obj, [field]: updateFields[field] }), {});

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: filteredUpdate,
    });

    res.json({ message: "Card updated", updatedCard });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const user = req.user.id;
    const { deckId, cardId } = req.body;

    const deck = await prisma.deck.findFirst({
      where: {
        id: deckId,
        userId: user.id,
      },
    });

    if (!deck) {
      return res
        .status(404)
        .json({ error: "Deck not found or does not belong to the user." });
    }

    const card = await prisma.card.findFirst({
      where: {
        id: parseInt(cardId),
        deckId: deckId,
      },
    });

    if (!card) {
      return res
        .status(404)
        .json({ error: "Card not found in the specified deck." });
    }

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
