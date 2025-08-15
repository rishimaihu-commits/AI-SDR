import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/parse", async (req, res) => {
  const { input } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Extract the following fields from the user input related to a campaign prompt: role, department, industry, country, additional. Return ONLY JSON with these keys. If any are missing, leave them blank.",
          },
          { role: "user", content: input },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const parsed = JSON.parse(content);
    res.json(parsed);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("OpenAI Axios error:", err.response?.data || err.message);
    } else {
      console.error("Unknown error:", err);
    }
    res.status(500).json({ error: "Failed to parse input" });
  }
});

export default router;
