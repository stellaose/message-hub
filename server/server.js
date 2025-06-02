import app from "./app.js";
import dotenv from "dotenv";
import databaseConnection from "./database/index.js";

dotenv.config();

const port = process.env.PORT || 3030;

// Handling uncaught exception
process.on("uncaughtException", err => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


databaseConnection.getConnect()
// Unhandled promise rejection
process.on("unhandledRejection", err => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled rejection");

  server.close(() => {
    process.exit(1);
  });
});
