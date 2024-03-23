import { app } from "./app.js";
import dotenv, { config } from "dotenv";
dotenv.config({ path: "./env" });
import connectDB from "./db/connection.js";

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection FAILED !", error);
  });

// Unhandeled Rejection --
// process.on("unhandledRejection", (err) => {
//   console.log(`Error : ${err.message}`);
//   console.log(`Shutting down the server due to Unhandled Rejection`);
//   server.close(() => process.exit(1));
// });
