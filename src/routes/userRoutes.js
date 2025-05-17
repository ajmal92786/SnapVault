const express = require("express");
const userRoutes = express.Router();
const { createNewUser } = require("../controllers/userController");

userRoutes.post("/users", createNewUser);

module.exports = { userRoutes };
