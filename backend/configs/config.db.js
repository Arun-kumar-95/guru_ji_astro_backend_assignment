const mongoose = require("mongoose");

module.exports.connect = async (DB_URL) => {
  // IF DATABASE URL NOT PROVIDED
  if (!DB_URL) {
    return console.log("Invalid DATABASE_URL");
  }

  // DATABASE OPTIONS
  const OPTIONS = {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  const dbConnect = await mongoose.connect(DB_URL, OPTIONS);

  if (!dbConnect) {
    return console.log("Error connecting to database");
  } else {
    return console.log("Connected to database");
  }
};
