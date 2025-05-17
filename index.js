const express = require("express");
const { userRoutes } = require("./src/routes/userRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Pic Storage App");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
