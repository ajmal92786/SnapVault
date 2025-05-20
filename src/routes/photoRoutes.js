const { Router } = require("express");
const { searchPhotos, savePhoto } = require("../controllers/photoController");
const { addPhotoTags } = require("../controllers/tagController");

const photoRoutes = Router();

photoRoutes.get("/search", searchPhotos); // route to search photos from UNSPLASH
photoRoutes.post("/", savePhoto); // route to save photo on Supabase
photoRoutes.post("/:photoId/tags", addPhotoTags); // route to adding Tags for Photos

module.exports = { photoRoutes };
