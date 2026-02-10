const express = require("express");
const connectDB = require("./config/database");
const globalError = require("./core/errors/globalErrors");
const app = express();
app.use(express.json());

//ROUTES
const authRoutes = require("./modules/auth/routes/authRoutes");

connectDB();

app.use("/api/v1", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(globalError);
module.exports = app;
