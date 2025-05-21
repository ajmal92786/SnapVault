const { Router } = require("express");
const {
  searchPhotos,
  savePhoto,
  searchPhotosByTag,
} = require("../controllers/photoController");
const { addPhotoTags } = require("../controllers/tagController");

const photoRoutes = Router();

photoRoutes.get("/search", searchPhotos); // route to search photos from UNSPLASH
photoRoutes.post("/", savePhoto); // route to save photo on Supabase
photoRoutes.post("/:photoId/tags", addPhotoTags); // route to adding tags for photos
photoRoutes.get("/tag/search", searchPhotosByTag); // route for searching photos by tags and sorting by date saved

module.exports = { photoRoutes };
