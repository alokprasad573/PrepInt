const express = require("express");
const app = express();
const chalk = require("chalk");
const mongoose = require("mongoose");
require('dotenv').config();

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
