const axios = require("axios");

exports.sendMessage = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required." });

  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(url, {
      contents: [{ role: "user", parts: [{ text: message }] }],
    });
    const text =
      response.data.candidates[0].content.parts[0].text.replace(
        /\*\*(.*?)\*\*/g,
        "$1"
      );
    res.json({ reply: text });
  } catch (err) {
    const msg = err.response?.data?.error?.message || "Chatbot unavailable.";
    res.status(500).json({ error: msg });
  }
};
