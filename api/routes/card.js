import express from "express";
import { PrismaClient } from "@prisma/client";

import { verifyToken } from "../utils/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

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

    const card = await prisma.card.create({
      data: {
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
