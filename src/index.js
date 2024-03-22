import { app } from "./app.js";
import dotenv, { config } from "dotenv";
dotenv.config({ path: "./env" });
import connectDB from "./db/connection.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection FAILED !", error);
  });
