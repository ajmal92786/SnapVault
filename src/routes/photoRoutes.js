const { Router } = require("express");
const { searchPhotos } = require("../controllers/photoController");

const photoRoutes = Router();

photoRoutes.get("/search", searchPhotos);

module.exports = { photoRoutes };
