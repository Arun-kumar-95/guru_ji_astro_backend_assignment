const express = require("express");
const app = express();
const dotenv = require("dotenv");

// HANDLING UNCAUGH ERRORS

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

let server = null;
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./backend/configs/config.env" });
}
const { connect } = require("../configs/config.db.js");

if (connect(process.env.DB_URL)) {
  // connect the server if we have database connected
  server = app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
  });
}

// unhandled promise rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("shutting down the server");

  // closing the server
  server.close(() => {
    process.exit(1);
  });
});
module.exports = app;
