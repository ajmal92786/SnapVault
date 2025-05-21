const express = require("express");
const searchHistoryRoutes = express.Router();
const {
  getUserSearchHistory,
} = require("../controllers/searchHistoryController");

searchHistoryRoutes.get("/", getUserSearchHistory);

module.exports = { searchHistoryRoutes };
