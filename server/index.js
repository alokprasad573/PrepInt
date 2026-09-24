const express = require("express");
const app = express();
const chalk = require("chalk");
const cors = require("cors");
const path = require("path")
const mongoose = require("mongoose");
require('dotenv').config();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["*"]
  })
)

app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads", {})))

const altasConnect = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("✅ Database Connected Successfully");
    console.log(`Database Link :- ${chalk.blue(process.env.ATLAS_URI)}`);
  } catch (error) {
    console.error("❌ Database Connection Failed");
    throw error;
  }
};

altasConnect()
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

app.get("/", (req, res) => {
  res.status(200).json({ stattus: res.status, message: "Hello world" });
});
