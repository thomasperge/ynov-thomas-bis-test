import express from "express";
import { countOccurrences } from "./wordCount";

const app = express();
app.use(express.json());

app.post("/count", (req, res) => {
  const { text, word } = req.body;

  if (!text || !word) {
    return res.status(400).json({ message: "text and word are required" });
  }

  const count = countOccurrences(text, word);
  return res.json({ count });
});

export default app;
