import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import productsRoute from "./routes/productsRoute.js";
import cors from "cors";

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS policy
app.use(
  cors({
    origin: "https://mern-app-ekf3.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/", (req, res) => {
  return res.status(200).send("Welcome");
});

app.use("/products", productsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("App failed to connect to database. Error: " + error);
  });
