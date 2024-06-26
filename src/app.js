import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// middlewares
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );
app.use(cors());
// json file
app.use(express.json({ limit: "16kb" }));
// url data
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
// static files
app.use(express.static("public"));
app.use(cookieParser());

// imports route
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/orders.routes.js";

app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);

export { app };
