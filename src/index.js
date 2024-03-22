import { app } from "./app.js";
import dotenv, { config } from "dotenv";
dotenv.config({ path: "./env" });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
