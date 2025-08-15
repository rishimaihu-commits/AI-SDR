// backend/routes/groqRoutes.ts
import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      throw new Error(errText);
    }

    const data = await groqResponse.json();
    res.json(data);
  } catch (err: any) {
    console.error("Groq API error:", err);
    res.status(500).json({ error: "Failed to call Groq API" });
  }
});

export default router;
