const { GoogleGenAI } = require("@google/genai");
const {
  conceptExplainPrompt,
  questionAnswerPromt,
} = require("../utils/prompt");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//@desc   Generate interview questions and answers using Gemini
//@route  POST /api/ai/generate-questions
//@access Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPromt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions,
    );
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    let rawText = response.text;

    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to genearte questions",
      error: error.message,
    });
  }
};

//@desc    Genearete expalins a interview questions
//@route   POST /api/ai/generate-explanation
//@access  Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ message: "Missing required fields." })
    }

    const prompt = conceptExplainPrompt(question)
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    let rawText = response.text;

    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    const data = JSON.parse(cleanedText);

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      message: "",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
