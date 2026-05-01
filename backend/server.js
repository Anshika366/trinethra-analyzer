const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const transcript = req.body.transcript;

  const prompt = `
You are an HR performance analyst.

Analyze this supervisor feedback transcript.

Return ONLY valid JSON in this format:

{
  "score": {
    "value": 1,
    "label": "",
    "band": "",
    "justification": ""
  },
  "evidence": [
    {
      "quote": "",
      "signal": "",
      "dimension": "",
      "interpretation": ""
    }
  ],
  "kpiMapping": [
    {
      "kpi": "",
      "evidence": ""
    }
  ],
  "gaps": [
    {
      "dimension": "",
      "detail": ""
    }
  ],
  "followUpQuestions": [
    {
      "question": ""
    }
  ]
}

Transcript:
${transcript}
`;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.2",
      prompt: prompt,
      stream: false,
    });

    let text = response.data.response.trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;
    text = text.slice(start, end);

    const parsed = JSON.parse(text);

    res.json(parsed);
  } catch (error) {
    res.status(500).json({
      error: "Failed to analyze",
      details: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
