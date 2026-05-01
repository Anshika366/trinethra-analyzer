const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { transcript } = req.body;
  const prompt = `Analyze feedback: "${transcript}". 
    Return ONLY JSON: {
      "score": { "value": 1-5, "label": "string", "band": "A/B/C", "justification": "string" },
      "evidence": [{ "quote": "exact words", "interpretation": "string" }],
      "followUpQuestions": [{ "question": "string" }]
    }`;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: prompt,
      stream: false,
      format: "json",
    });
    res.json(JSON.parse(response.data.response));
  } catch (err) {
    res.status(500).json({ error: "Ollama Error" });
  }
});

app.listen(5000, () => console.log("Backend Running: 5000"));
