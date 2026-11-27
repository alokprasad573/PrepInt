const { GoogleGenAI } = require("@google/genai");
const {
  conceptExplainPrompt,
  questionAnswerPromt,
} = require("../utils/prompt");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Strips optional markdown JSON code fences and parses model output.
 */
const parseGeminiJson = (rawText = "") => {
  const cleanedText = String(rawText)
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  return JSON.parse(cleanedText);
};

//@desc   Generate interview questions and answers using Gemini
//@route  POST /api/ai/generated-questions
//@access Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    const isMissingExperience =
      experience === undefined ||
      experience === null ||
      String(experience).trim() === "" ||
      Number.isNaN(Number(experience));

    if (
      !role ||
      isMissingExperience ||
      !topicsToFocus ||
      !numberOfQuestions ||
      Number(numberOfQuestions) <= 0
    ) {
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

    const data = parseGeminiJson(response.text);

    res.status(200).json(data);
  } catch (error) {
    console.error("Generate interview questions error:", error);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

//@desc    Generate explanation for an interview question
//@route   POST /api/ai/generate-explanation
//@access  Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const prompt = conceptExplainPrompt(question);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    const data = parseGeminiJson(response.text);

    res.status(200).json(data);
  } catch (error) {
    console.error("Generate concept explanation error:", error);
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
