import "dotenv/config";
import express from "express";

import userRouter from "./routes/user.js";
import deckRouter from "./routes/deck.js";
import cardRouter from "./routes/card.js";

const app = express();

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/decks", deckRouter);
app.use("/api/cards", cardRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
