const mongoose = require("mongoose");
const chalk = require("chalk");

const atlasConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database Connected Successfully");
    console.log(`Database Link :- ${chalk.blue(process.env.MONGO_URI)}`);
  } catch (error) {
    console.error("❌ Database Connection Failed");
    throw error;
  }
};

module.exports = { atlasConnect };
