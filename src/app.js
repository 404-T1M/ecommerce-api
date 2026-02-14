const express = require("express");
const connectDB = require("./config/database");
const globalError = require("./core/errors/globalErrors");
const app = express();
app.use(express.json());

//ROUTES
const usersRoutes = require("./modules/users/routes/usersRoutes");
const adminGroupRoutes = require("./modules/administratorsGroup/routes/adminGroupRoutes");

connectDB();

app.use("/api/v1", usersRoutes);
app.use("/api/v1/admin", adminGroupRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(globalError);
module.exports = app;
