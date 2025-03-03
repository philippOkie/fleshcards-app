import { Router } from "express";
const router = Router();

import { verifyToken } from "../utils/auth.js";

import prisma from "../utils/prismaClient.js";

router.get("/pictures", verifyToken, async (req, res) => {
  let query = req.query.query && req.query.query.trim();
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const page = req.query.page || 1;
  const per_page = req.query.per_page || 7;
  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  const isEnglish = /^[a-zA-Z0-9\s.,!?'"-]+$/.test(query);

  try {
    if (!isEnglish) {
      const params = new URLSearchParams({
        auth_key: process.env.DEEPL_KEY,
        text: query,
        target_lang: "EN",
      });

      const translateResponse = await fetch(
        "https://api-free.deepl.com/v2/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );

      if (!translateResponse.ok) {
        const errorDetails = await translateResponse.text();
        throw new Error(
          `Translation error! Status: ${translateResponse.status}, Details: ${errorDetails}`
        );
      }

      const translationData = await translateResponse.json();
      if (
        translationData.translations &&
        translationData.translations.length > 0
      ) {
        query = translationData.translations[0].text;
        console.log(`Translated query from non-English to: "${query}"`);
      }
    }

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
      alt_description: pic.alt_description || "Image",
      original_query: req.query.query.trim(),
      translated_query: isEnglish ? null : query,
    }));

    res.json({
      results: pictures,
      translated: !isEnglish,
    });
  } catch (error) {
    console.error("Error in picture search:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/translate", verifyToken, async (req, res) => {
  const { text, sourceLanguage, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res
      .status(400)
      .json({ message: "Text and targetLanguage are required." });
  }

  try {
    const params = new URLSearchParams({
      auth_key: process.env.DEEPL_KEY,
      text: text,
      target_lang: targetLanguage.toUpperCase(),
    });

    if (sourceLanguage) {
      params.append("source_lang", sourceLanguage.toUpperCase());
    }

    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, Details: ${errorDetails}`
      );
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error translating text:", error.message);
    res.status(500).json({
      message: "Translation failed. Please try again.",
      error: error.message,
    });
  }
});

export default router;
