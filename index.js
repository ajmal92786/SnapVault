const express = require("express");
const { userRoutes } = require("./src/routes/userRoutes");
const { photoRoutes } = require("./src/routes/photoRoutes");
const { searchHistoryRoutes } = require("./src/routes/searchHistoryRoutes");

const app = express();
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/search-history", searchHistoryRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the SnapVault App");
});

module.exports = { app };
