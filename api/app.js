import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";

import userRouter from "./routes/user.js";

const app = express();

app.use(express.json());

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
