const mongoose = require("mongoose");
const app = require("./app");
const { mongoUri, port } = require("./config/env");

async function start() {
  try {
    await mongoose.connect(mongoUri);
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}

start();
