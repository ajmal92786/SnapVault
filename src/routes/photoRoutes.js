const { Router } = require("express");
const { searchPhotos } = require("../controllers/photoController");
const { savePhoto } = require("../controllers/photoController");

const photoRoutes = Router();

photoRoutes.get("/search", searchPhotos); // route to search photos from UNSPLASH
photoRoutes.post("/", savePhoto); // route to save photo on Supabase

module.exports = { photoRoutes };
