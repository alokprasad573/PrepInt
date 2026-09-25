const express = require("express");
const app = express();
const chalk = require("chalk");
const cors = require("cors");
const path = require("path")
const mongoose = require("mongoose");
require('dotenv').config();

const { atlasConnect } = require("./config/db");
const { protect } = require("./middlewares/auth.middleware");
const authRoutes = require("./routes/auth.routes");
const sessionRoutes = require("./routes/session.routes");
const questionsRoutes = require("./routes/question.routes");
const { generateInterviewQuestions, generateConceptExplanation} = require("./controllers/ai.controller")

// Global Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
)

app.use(express.json());

atlasConnect()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `🚀 Server running at ${chalk.blue.underline(`http://localhost:${process.env.PORT || 8000}`)}`,
      );
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionsRoutes);

app.get("/api/ai/generated-questions", protect, generateInterviewQuestions);
app.get("/api/ai/generate-explanation", protect, generateConceptExplanation);
