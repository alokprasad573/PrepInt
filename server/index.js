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
const normalizeOrigin = (url) => (url ? url.replace(/\/+$/, "") : "");

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  normalizeOrigin(process.env.CLIENT_URL),
].filter(Boolean);

const PORT = process.env.PORT || 8000

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed bt CORS"))
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
)

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 500
        ? chalk.red
        : res.statusCode >= 400
          ? chalk.yellow
          : chalk.green;
    console.log(
      `${chalk.gray(new Date().toLocaleTimeString())} ${chalk.cyan(req.method)} ${req.originalUrl} ${statusColor(res.statusCode)} ${chalk.gray(`${duration}ms`)}`,
    );
  });
  next();
});

if (!process.env.VERCEL) {
  atlasConnect()
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `🚀 Server running at ${chalk.blue.underline(`http://localhost:${PORT}`)}`,
        );
      });
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
} else {
  atlasConnect().catch((err) => {
    console.log(err);
  });
}


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionsRoutes);

app.post("/api/ai/generated-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);

module.exports = app;
