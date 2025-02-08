import "dotenv/config";
import express from "express";
import cors from "cors";

import userRouter from "./routes/user.js";
import deckRouter from "./routes/deck.js";
import cardRouter from "./routes/card.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/decks", deckRouter);
app.use("/api/cards", cardRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
